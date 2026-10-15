#!/usr/bin/env node
/*
 * Builds ../Comprehensive_Assignment_1.docx from the screenshots in ../screenshots.
 *
 * Sections 3-8 embed the genuine terminal screenshots captured by capture.py.
 * Sections 1-2 (Windows installer and Start menu) must come from the student's
 * own computer, so they are emitted as yellow placeholders that are
 * replaced by pasting a screenshot over them in Word.
 *
 * Usage: node build/build_docx.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {
  AlignmentType, BorderStyle, Document, ExternalHyperlink, Header, HeadingLevel, ImageRun, Packer,
  LineRuleType, PageNumber, Paragraph, ShadingType, TextRun,
} = require('docx');

const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(ROOT, 'screenshots');
const OUT = path.join(ROOT, 'Comprehensive_Assignment_1.docx');

const FONT = 'Calibri';
const MONO = 'Consolas';
const NAVY = '1F3864';
const BLUE = '2E5597';
const GREY = '595959';
const PX_PER_INCH = 140; // uniform print scale for every screenshot

// ---------------------------------------------------------------- helpers

/** Inline markup: `code` renders in Consolas, **text** in bold, {{text}} in italics. */
function runs(text, base = {}) {
  const out = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\{\{[^}]+\}\})/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(new TextRun({ ...base, text: text.slice(last, m.index) }));
    const tok = m[0];
    if (tok.startsWith('`')) {
      out.push(new TextRun({ ...base, text: tok.slice(1, -1), font: MONO, size: 20 }));
    } else if (tok.startsWith('{{')) {
      out.push(new TextRun({ ...base, text: tok.slice(2, -2), italics: true }));
    } else {
      out.push(new TextRun({ ...base, text: tok.slice(2, -2), bold: true }));
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(new TextRun({ ...base, text: text.slice(last) }));
  return out;
}

const p = (text, opts = {}) => new Paragraph({ children: runs(text), ...opts });
const lead = (text) => p(text, { keepNext: true });

function h1(text, pageBreak = true) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, pageBreakBefore: pageBreak, children: [new TextRun(text)],
  });
}
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });

const CODE_FILL = 'F2F4F8';

/**
 * SQL exactly as it should be typed, as shaded paragraphs with a blue bar.
 * Paragraphs (not a table) so that "keep with next" holds the block on the
 * same page as its screenshot in Word, LibreOffice and Google Docs alike.
 * Only a left border is used: docx serializes pBdr children as top, bottom,
 * left, right, which breaks the schema order (top, left, bottom, right) as
 * soon as more than one side is set. Thin shaded spacer lines provide the
 * top and bottom padding instead.
 */
function code(lines) {
  const line = (text, size) => new Paragraph({
    keepNext: true,
    keepLines: true,
    spacing: { before: 0, after: 0, line: 252, lineRule: LineRuleType.AUTO },
    indent: { left: 260, right: 140 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: CODE_FILL },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: BLUE, space: 9 } },
    children: [new TextRun({ text, font: MONO, size, color: '1A1A1A' })],
  });
  const spacer = () => line(' ', 8);
  return [spacer(), ...lines.map((l) => line(l === '' ? ' ' : l, 19)), spacer()];
}

/** A screenshot, centered, at a uniform print scale so text size is identical in every figure. */
function figure(file, alt) {
  const data = fs.readFileSync(path.join(SHOTS, file));
  const w = data.readUInt32BE(16);
  const h = data.readUInt32BE(20);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 160, after: 60, line: 240, lineRule: LineRuleType.AUTO },
    children: [new ImageRun({
      type: 'png',
      data,
      transformation: { width: Math.round((w / PX_PER_INCH) * 96), height: Math.round((h / PX_PER_INCH) * 96) },
      altText: { title: alt, description: alt, name: file },
    })],
  });
}

function caption(num, text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [
      new TextRun({ text: `Figure ${num}. `, bold: true, size: 19, color: GREY }),
      ...runs(text, { italics: true, size: 19, color: GREY }),
    ],
  });
}

// Yellow run shading (w:shd). docx's `highlight` option also emits w:highlightCs,
// which is not in the OOXML schema, so shading is used instead.
const MARK = { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF200' };

/** Yellow placeholder for a screenshot that must be taken on the student's own PC. */
function placeholder(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({ text: '[Insert screenshot: ', bold: true, shading: MARK }),
      ...runs(text, { shading: MARK }),
      new TextRun({ text: ']', bold: true, shading: MARK }),
    ],
  });
}

/** One SQL task: lead-in, statement(s), screenshot, caption, interpretation. */
function sqlTask({ intro, sql, file, num, cap, alt, after }) {
  const out = [];
  if (intro) out.push(lead(intro));
  out.push(...code(sql), figure(file, alt || cap), caption(num, cap));
  for (const t of [].concat(after || [])) out.push(p(t));
  return out;
}

/** One installer / command-prompt step: heading, description, placeholder, caption. */
function step({ title, text, shot, num, cap, sql }) {
  const out = [h2(title)];
  for (const t of [].concat(text)) out.push(p(t, { keepNext: true }));
  if (sql) out.push(...code(sql));
  out.push(placeholder(shot), caption(num, cap));
  return out;
}

const centered = (text, opts = {}) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: runs(text, opts),
});
const fillIn = (text) => new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [new TextRun({ text })],
});

// ---------------------------------------------------------------- content

const titlePage = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2600, after: 120 },
    children: [new TextRun({ text: 'Comprehensive Assignment 1', bold: true, size: 36, color: NAVY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: 'MariaDB Setup and SQL Fundamentals', bold: true, size: 30, color: NAVY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 960 },
    children: [new TextRun({ text: 'Week 3', size: 24, color: GREY })],
  }),
  fillIn('[Student Full Name]'),
  centered('Walsh College'),
  fillIn('[Course Number]: [Course Title]'),
  fillIn('[Instructor Name]'),
  fillIn('[Due Date]'),
];

const introduction = [
  h1('Introduction'),
  p('This report documents a hands-on exercise in installing and using MariaDB, the open-source relational database management system that began as a fork of MySQL. Earlier in the course, MariaDB was used as part of the XAMPP bundle. This assignment takes a different route: the server is installed on its own as a Windows application, and all of the work that follows is carried out from the command line rather than through a graphical control panel.'),
  p('The report follows the structure of the assignment and of the MariaDB guide provided for the course (Walsh College, 2026). Section 1 documents the twelve installation steps, and Section 2 the four steps needed to open the MariaDB command prompt and log in. Sections 3 to 7 cover the creation of the Demo database, its selection, the creation of the Book and Price tables, and the commands that list the tables and describe their structure. Section 8 demonstrates the four CRUD operations (create, read, update and delete) together with the WHERE, LIKE, ORDER BY, DISTINCT and FROM clauses. For each task, the SQL statement is given first, followed by a screenshot of the statement and the server’s response, and then a short interpretation of the result.'),
  p('Two conventions apply throughout. SQL keywords are written in upper case for readability, although MariaDB does not require it. Object names are written as they appear in the course guide, which sometimes refers to the same table as `Book` and sometimes as `book`. This works because MariaDB on Windows stores database and table names in lower case and compares them without regard to case, a behavior controlled by the server variable `lower_case_table_names`, whose default value on Windows is 1 (MariaDB, n.d.-a).'),
];

const section1 = [
  h1('Section 1: Installation of MariaDB'),
  p('MariaDB Server was installed as a standalone application from its official Windows installer, an MSI package that guides the user through a short wizard (MariaDB, n.d.-b). The course guide illustrates the procedure with MariaDB 10.3; this installation used MariaDB 12.3, the current long-term support (LTS) release, so a few screens look slightly different, and those differences are noted at the relevant steps. Before the installer was started, the MySQL module in the XAMPP Control Panel was confirmed to be stopped, because it also listens on TCP port 3306, the port the new server would use.'),
  ...step({
    title: 'Step 1: Open the Download Page and Download the Installer',
    text: 'The MariaDB Server download page (MariaDB Foundation, n.d.) was opened in a web browser. MariaDB Server 12.3, the latest LTS release, was selected, together with Windows as the operating system, x86_64 as the architecture and MSI as the package type, and the installer was downloaded (Figure 1.1).',
    shot: 'the MariaDB download page showing the selected release, operating system (Windows), architecture (x86_64) and package type (MSI)',
    num: '1.1', cap: 'Selecting the Windows MSI package on the MariaDB download page.',
  }),
  ...step({
    title: 'Step 2: Start the Installation',
    text: 'When the download had finished, the installer file, named in the form `mariadb-12.3.x-winx64.msi`, was opened from the browser’s download list. Double-clicking the file in File Explorer has the same effect (Figure 1.2).',
    shot: 'the downloaded .msi file in the browser’s download list or in File Explorer, about to be opened',
    num: '1.2', cap: 'Opening the downloaded MSI installer.',
  }),
  ...step({
    title: 'Step 3: Click Next',
    text: 'The Setup Wizard opened on its welcome page, which names the product and the version being installed. Next was clicked to continue (Figure 1.3).',
    shot: 'the “Welcome to the MariaDB 12.3 (x64) Setup Wizard” page',
    num: '1.3', cap: 'The welcome page of the Setup Wizard.',
  }),
  ...step({
    title: 'Step 4: Accept the License Agreement',
    text: 'The End-User License Agreement page displays the GNU General Public License, version 2, under which MariaDB Server is distributed. The check box “I accept the terms in the License Agreement” was selected and Next was clicked (Figure 1.4).',
    shot: 'the End-User License Agreement page with the acceptance check box selected',
    num: '1.4', cap: 'Accepting the GNU General Public License, version 2.',
  }),
  ...step({
    title: 'Step 5: Choose MariaDB Server',
    text: 'The Custom Setup page lists the components that can be installed. The default selection, which includes the database server and its client programs, was kept, as was the default installation folder under Program Files, and Next was clicked (Figure 1.5).',
    shot: 'the Custom Setup page showing the feature tree and the installation location',
    num: '1.5', cap: 'Choosing the features to install on the Custom Setup page.',
  }),
  ...step({
    title: 'Step 6: Enter the Password',
    text: 'On the User settings page, headed “Default instance properties,” the option “Modify password for database user ‘root’” was kept selected, and a password for the root account was entered and then retyped to confirm it. The option that enables access from remote machines for the root user was left unchecked, which is the safer choice for a database that is used only on this computer (Figure 1.6).',
    shot: 'the User settings page with the root password entered and confirmed (the password itself appears only as dots)',
    num: '1.6', cap: 'Setting the password of the root account.',
  }),
  ...step({
    title: 'Step 7: Enter the Service Name and Choose the Port Number',
    text: 'The Database settings page determines how the server runs. “Install as service” was kept selected with the default service name, MariaDB, so that Windows starts the server automatically, and “Enable networking” was kept with TCP port 3306, the standard port for MariaDB and MySQL. The InnoDB buffer pool size and page size were left at their default values. The guide shows the service name MySQL because that was the default up to version 10.3; later versions use MariaDB (MariaDB, n.d.-b). Figure 1.7 shows the settings used.',
    shot: 'the Database settings page showing the service name (MariaDB) and the TCP port (3306)',
    num: '1.7', cap: 'Choosing the service name and the TCP port.',
  }),
  ...step({
    title: 'Step 8: Click Next',
    text: 'In the version 10.3 installer shown in the guide, the page that followed Database settings was a separate screen offering to enable the optional Feedback plugin, which sends anonymous usage statistics to the MariaDB developers. Current releases no longer have that screen (where the option is still offered, it appears on the User settings page), so clicking Next on the Database settings page leads directly to the Ready to install page (Figure 1.8).',
    shot: 'the page that appears after clicking Next on the Database settings page; in current versions this is “Ready to install MariaDB 12.3 (x64)”',
    num: '1.8', cap: 'The page displayed after the database settings were confirmed.',
  }),
  ...step({
    title: 'Step 9: Click Install',
    text: 'The Ready to install page indicates that all of the settings have been collected. Install was clicked, and the Windows User Account Control prompt that followed was approved, because the installer needs administrator rights to write to the Program Files folder and to register a Windows service (Figure 1.9).',
    shot: 'the Ready to install page with the pointer on the Install button',
    num: '1.9', cap: 'Starting the installation.',
  }),
  ...step({
    title: 'Step 10: A Progress Bar Is Shown',
    text: 'A progress bar then tracked the installation while the program files were copied, the data directory was initialized, and the MariaDB service was registered and started (Figure 1.10).',
    shot: 'the “Installing MariaDB 12.3 (x64)” page with the progress bar, taken while the installation is running',
    num: '1.10', cap: 'The installation in progress.',
  }),
  ...step({
    title: 'Step 11: Click Finish',
    text: 'When the wizard reported that the setup was complete, Finish was clicked to close it (Figure 1.11).',
    shot: 'the “Completed the MariaDB 12.3 (x64) Setup Wizard” page with the Finish button',
    num: '1.11', cap: 'The final page of the Setup Wizard.',
  }),
  ...step({
    title: 'Step 12: MariaDB Is Installed',
    text: 'Finally, the installation was confirmed outside the wizard. The Windows Services console (opened by running `services.msc`) lists the MariaDB service with the status Running, which shows that the server was installed correctly and is active (Figure 1.12).',
    shot: 'the Services window (Win + R, type services.msc, press Enter) showing the MariaDB service with the status Running',
    num: '1.12', cap: 'The MariaDB service running after the installation.',
  }),
];

const section2 = [
  h1('Section 2: Working with Command Prompt'),
  p('With the server installed and running, the next task was to connect to it through the MariaDB command-line client, which was used for all of the remaining work in this report.'),
  ...step({
    title: 'Step 1: Open the MariaDB Program Group',
    text: 'The Start menu was opened, and under All apps (All Programs in older versions of Windows) the MariaDB 12.3 (x64) folder was expanded to show the shortcuts created by the installer (Figure 2.1).',
    shot: 'the Start menu showing the MariaDB 12.3 (x64) folder and its shortcuts',
    num: '2.1', cap: 'The MariaDB program group in the Start menu.',
  }),
  ...step({
    title: 'Step 2: Choose a MariaDB Command Prompt',
    text: 'From this folder, Command Prompt (MariaDB 12.3 (x64)) was selected. The shortcut opens an ordinary Windows command prompt in which the MariaDB bin folder has been added to the PATH, so the client programs can be started without typing their full location. The window confirms this with the message “Setting environment for MariaDB 12.3 (x64)” (Figure 2.2).',
    shot: 'the Command Prompt window that opens, showing “Setting environment for MariaDB 12.3 (x64)”',
    num: '2.2', cap: 'The MariaDB Command Prompt.',
  }),
  ...step({
    title: 'Step 3: Log In as the Root User',
    text: 'The command-line client was started by typing the following command at the prompt:',
    sql: ['mysql -u root -p'],
    shot: 'the command mysql -u root -p typed at the prompt, followed by “Enter password:”',
    num: '2.3', cap: 'Starting the command-line client as the root user.',
  }),
  p('The `-u` option names the account to log in with (root), and `-p` tells the client to ask for the password interactively instead of accepting it on the command line, which keeps the password off the screen and out of the command history. The client can also be started as `mariadb`, its native name in current releases; both names start the same command-line client (MariaDB, n.d.-c).'),
  ...step({
    title: 'Step 4: Enter the Password',
    text: 'After the root password was entered, with each character masked as an asterisk, the client displayed its welcome message, including the connection id and the server version, followed by the prompt `MariaDB [(none)]>`. The word “(none)” in the brackets means that no database has been selected yet (Figure 2.4).',
    shot: 'the welcome message and the MariaDB [(none)]> prompt after a successful login',
    num: '2.4', cap: 'A successful login to the MariaDB monitor.',
  }),
];

const section3 = [
  h1('Section 3: Create a Database and Tables'),
  ...sqlTask({
    intro: 'Creating a database requires the CREATE privilege, which the root account holds. The Demo database was created with the CREATE DATABASE statement:',
    sql: ['CREATE DATABASE Demo;'],
    file: 'fig_3_1.png', num: '3.1', cap: 'Creating the Demo database.',
    after: 'The server replied `Query OK, 1 row affected`, which confirms that the statement succeeded.',
  }),
  ...sqlTask({
    intro: 'The result was then verified by listing all of the databases on the server:',
    sql: ['SHOW DATABASES;'],
    file: 'fig_3_2.png', num: '3.2', cap: 'Listing the databases to confirm that Demo exists.',
    after: 'Figure 3.2 includes `demo` in the list, so the database exists. It appears in lower case for the reason given in the introduction. The other entries are schemas that MariaDB creates for its own use; for example, `mysql` stores user accounts and privileges, and `information_schema` provides read-only information about the server’s databases, tables and columns.',
  }),
];

const section4 = [
  h1('Section 4: Selecting a Database'),
  ...sqlTask({
    intro: 'Before tables can be created, the database that will hold them has to be selected with the USE statement. The DATABASE() function was then called to confirm the selection:',
    sql: ['USE Demo;', 'SELECT DATABASE();'],
    file: 'fig_4_1.png', num: '4.1', cap: 'Selecting the Demo database and confirming the selection.',
    after: 'The server answered `Database changed`, and the prompt changed from `MariaDB [(none)]>` to `MariaDB [Demo]>`. From this point on, any statement that does not name a database explicitly is executed against Demo. The DATABASE() function, which returns the name of the current default database, returned `demo`.',
  }),
];

const section5 = [
  h1('Section 5: Creating a Table'),
  ...sqlTask({
    intro: 'Two tables, each with two columns, were created inside Demo. The first, Book, stores an identifier and a title:',
    sql: ['CREATE TABLE Book(', 'id INT NOT NULL AUTO_INCREMENT,', 'name VARCHAR(100) NOT NULL,', 'PRIMARY KEY (id));'],
    file: 'fig_5_1.png', num: '5.1', cap: 'Creating the Book table.',
    after: 'The `id` column is an integer that may not be NULL. AUTO_INCREMENT allows MariaDB to generate the next number automatically when no value is supplied, and `PRIMARY KEY (id)` makes `id` the column that uniquely identifies each row. The `name` column is a VARCHAR(100), a variable-length string of up to 100 characters, and is also mandatory. The server replied `Query OK, 0 rows affected`, which is the normal response to a statement that changes the structure of the database rather than its data.',
  }),
  ...sqlTask({
    intro: 'The second table, Price, follows the same pattern, except that its second column stores a number:',
    sql: ['CREATE TABLE Price(', 'id INT NOT NULL AUTO_INCREMENT,', 'price float NOT NULL,', 'PRIMARY KEY (id));'],
    file: 'fig_5_2.png', num: '5.2', cap: 'Creating the Price table.',
    after: 'Here `price` is declared as FLOAT, a floating-point type that can hold fractional values. FLOAT is used to follow the guide; for real monetary amounts, a fixed-point type such as DECIMAL(10,2) would be the better choice, because floating-point values are stored approximately and can introduce rounding errors into calculations.',
  }),
];

const section6 = [
  h1('Section 6: Showing Tables'),
  ...sqlTask({
    intro: 'SHOW TABLES lists the tables in the currently selected database:',
    sql: ['SHOW TABLES;'],
    file: 'fig_6_1.png', num: '6.1', cap: 'The tables contained in the Demo database.',
    after: 'Figure 6.1 lists `book` and `price` under the heading `Tables_in_demo`, which confirms that both CREATE TABLE statements succeeded. The names appear in lower case even though the tables were created as Book and Price, for the same reason that the database is listed as `demo`: MariaDB on Windows stores these names in lower case. This is also why later statements can refer to the tables as either Book or book.',
  }),
];

const section7 = [
  h1('Section 7: Showing Table Structure'),
  ...sqlTask({
    intro: 'DESC, short for DESCRIBE, displays the columns of a table together with their data types and constraints. The structure of Book was displayed first:',
    sql: ['DESC Book;'],
    file: 'fig_7_1.png', num: '7.1', cap: 'The structure of the Book table.',
    after: [
      'For each column, the output gives its data type (Type), whether NULL values are allowed (Null), whether the column belongs to a key (Key), its default value (Default) and any additional attributes (Extra). The result matches the design from Section 5: `id` is `int(11)`, does not accept NULL, is the primary key (`PRI`) and has the `auto_increment` attribute, while `name` is `varchar(100)` and is also NOT NULL. The 11 in `int(11)` is only a display width; it does not limit the size of the numbers that can be stored.',
    ],
  }),
  ...sqlTask({
    intro: 'The structure of Price was displayed in the same way:',
    sql: ['DESC Price;'],
    file: 'fig_7_2.png', num: '7.2', cap: 'The structure of the Price table.',
    after: 'Price has the same `id` column, and its second column, `price`, is of type `float` and does not accept NULL values. In both tables, NULL in the Default column means that no default value was defined.',
  }),
];

const section8 = [
  h1('Section 8: CRUD and Clauses'),
  p('CRUD is the usual name for the four basic operations on stored data: Create (INSERT), Read (SELECT), Update (UPDATE) and Delete (DELETE). The subsections below follow the order of the assignment. Because each operation changes the data that the next one works with, the figures also show how the contents of the two tables evolve.'),

  h2('a. INSERT'),
  ...sqlTask({
    intro: 'INSERT INTO adds new rows to a table. The column list names the columns that receive values, and the VALUES clause supplies the values in the same order. One row was added to each table:',
    sql: ["INSERT INTO book (id, name) VALUES(1, 'MariaDB Book');", 'INSERT INTO price (id, price) VALUES(1, 200);'],
    file: 'fig_8_1.png', num: '8.1', cap: 'Inserting one row into book and one row into price.',
    after: 'Each statement returned `Query OK, 1 row affected`. The `id` values were supplied explicitly to match the guide; because `id` is an AUTO_INCREMENT column, it could also have been left out, in which case MariaDB would have generated the value itself.',
  }),

  h2('b. SELECT'),
  ...sqlTask({
    intro: 'SELECT retrieves data. The asterisk selects every column, and because there is no WHERE clause, every row is returned:',
    sql: ['SELECT * from book;', 'SELECT * from price;'],
    file: 'fig_8_2.png', num: '8.2', cap: 'Reading the contents of book and price.',
    after: 'Figure 8.2 shows the single row now stored in each table: book contains (1, MariaDB Book) and price contains (1, 200).',
  }),

  h2('c. Inserting Multiple Records'),
  ...sqlTask({
    intro: 'A single INSERT statement can add several rows by listing more than one group of values, separated by commas. This is shorter to write than separate statements, and the server processes it as one operation. Four rows were added to book, and the table was queried again:',
    sql: ['INSERT INTO book (id, name) VALUES', "(2,'MariaDB Book2'),", "(3,'MariaDB Book3'),", "(4,'MariaDB Book4'),", "(5,'MariaDB Book5');", 'SELECT * FROM book;'],
    file: 'fig_8_3.png', num: '8.3', cap: 'Inserting four rows into book with a single statement.',
    after: 'The server reported `Query OK, 4 rows affected`, followed by `Records: 4  Duplicates: 0  Warnings: 0`, which means that all four rows were stored and none conflicted with an existing primary key. The SELECT that follows confirms that the table now holds five books.',
  }),
  ...sqlTask({
    intro: 'The same technique was used to add four rows to price:',
    sql: ['INSERT INTO price (id, price) VALUES', '(2, 250),', '(3, 220),', '(4, 190),', '(5, 300);', 'SELECT * FROM price;'],
    file: 'fig_8_4.png', num: '8.4', cap: 'Inserting four rows into price with a single statement.',
    after: 'Figure 8.4 shows the five prices now stored: 200, 250, 220, 190 and 300.',
  }),

  h2('d. UPDATE'),
  p('UPDATE modifies rows that already exist. The SET clause gives the new values, and the WHERE clause limits the change to the rows that should be affected; without WHERE, every row in the table would be changed. Three updates were carried out, each followed by a SELECT to verify the result.'),
  ...sqlTask({
    intro: 'First, the price with id 1 was changed from 200 to 250:',
    sql: ['UPDATE price SET price = 250 WHERE id = 1;', 'SELECT * FROM price;'],
    file: 'fig_8_5.png', num: '8.5', cap: 'Updating the price with id 1.',
    after: 'The line `Rows matched: 1  Changed: 1  Warnings: 0` shows that exactly one row met the condition and that it was modified; the table now shows 250 for id 1.',
  }),
  ...sqlTask({
    intro: 'Next, the name of book 1 was changed from MariaDB Book to MariaDB Book1:',
    sql: ['UPDATE book SET name = "MariaDB Book1" WHERE id = 1;', 'SELECT * FROM book;'],
    file: 'fig_8_6.png', num: '8.6', cap: 'Updating the name of book 1.',
    after: 'The update succeeded, and all five names now follow the same pattern. The guide prints this value between typographic (curly) quotation marks; when the statement is typed, straight quotation marks must be used, because the server does not recognize curly quotes as string delimiters. MariaDB accepts double quotes around strings by default, although single quotes are the SQL standard.',
  }),
  ...sqlTask({
    intro: 'Finally, a single UPDATE changed two columns at once, setting the id to 6 and the price to 280 for the row whose id was 5:',
    sql: ['UPDATE price SET id = 6, price = 280 WHERE id = 5;', 'SELECT * FROM price;'],
    file: 'fig_8_7.png', num: '8.7', cap: 'Updating two columns of one row with a single statement.',
    after: 'The assignments in the SET clause are separated by commas, and the WHERE condition identifies the row by its value before the update. The result shows the former row 5 as id 6, with a price of 280.',
  }),

  h2('e. DELETE'),
  ...sqlTask({
    intro: 'DELETE FROM removes the rows that satisfy the WHERE condition. The row created by the previous update, with id 6 and price 280, was deleted:',
    sql: ['DELETE FROM price WHERE id = 6;', 'SELECT * FROM price;'],
    file: 'fig_8_8.png', num: '8.8', cap: 'Deleting the row with id 6.',
    after: 'The server reported `Query OK, 1 row affected`, and the SELECT confirms that four rows remain. As with UPDATE, the WHERE clause is essential: `DELETE FROM price;` on its own would remove every row in the table.',
  }),

  h2('f. WHERE'),
  ...sqlTask({
    intro: 'The WHERE clause filters rows, so that only the rows for which the condition is true appear in the result. Using the four rows that remain in price (Figure 8.8), the following query returns the prices below 250:',
    sql: ['SELECT * FROM price WHERE price < 250;'],
    file: 'fig_8_9.png', num: '8.9', cap: 'Filtering rows with a WHERE condition.',
    after: 'Two rows qualify, with the prices 220 and 190.',
  }),
  ...sqlTask({
    intro: 'Conditions can be combined with AND, which requires both of them to be true, or with OR, which requires at least one of them to be true:',
    sql: ['SELECT * FROM price WHERE id > 3 AND price < 250;', 'SELECT * FROM price WHERE id > 3 OR price < 250;'],
    file: 'fig_8_10.png', num: '8.10', cap: 'Combining conditions with AND and with OR.',
    after: 'With AND, only id 4 (price 190) satisfies both conditions. With OR, ids 3 and 4 are returned: id 3 qualifies because its price, 220, is below 250, even though its id is not greater than 3. Rows 1 and 2 are excluded in both cases, because their id is not greater than 3 and their price, 250, is not below 250.',
  }),

  h2('g. LIKE'),
  ...sqlTask({
    intro: 'LIKE matches a value against a pattern. Two wildcard characters are available: `%` stands for any sequence of characters, including an empty one, and `_` stands for exactly one character. Three patterns were tested on the book table:',
    sql: ["SELECT name FROM book WHERE name LIKE 'M%';", "SELECT name FROM book WHERE name LIKE '%4';", "SELECT name FROM book WHERE name LIKE '%DB%';"],
    file: 'fig_8_11.png', num: '8.11', cap: 'Pattern matching with the % wildcard.',
    after: "`'M%'` matches all five names because each begins with M; `'%4'` matches only MariaDB Book4, the only name that ends in 4; and `'%DB%'` matches all five names because each contains DB. Under MariaDB’s default collation, the comparison is not case-sensitive, so `'m%'` would return the same rows.",
  }),
  ...sqlTask({
    intro: 'The `_` wildcard was tested on the price column:',
    sql: ["SELECT * FROM price WHERE price LIKE '1_0';", "SELECT * FROM price WHERE price LIKE '_2_';"],
    file: 'fig_8_12.png', num: '8.12', cap: 'Pattern matching with the _ wildcard.',
    after: "`'1_0'` matches 190, a three-character value that begins with 1 and ends with 0, and `'_2_'` matches 220, the only three-character value whose middle character is 2. Although price is a numeric column, MariaDB converts each value to text before applying the pattern, which is why LIKE can be used here.",
  }),
  ...sqlTask({
    intro: 'Finally, NOT reverses the test and returns the rows that do not match the pattern:',
    sql: ["SELECT * FROM price WHERE price NOT LIKE '2%';"],
    file: 'fig_8_13.png', num: '8.13', cap: 'Excluding rows with NOT LIKE.',
    after: 'Only the price 190 does not begin with 2.',
  }),

  h2('h. ORDER BY'),
  ...sqlTask({
    intro: 'ORDER BY sorts the rows of a result. The three queries in this subsection select the prices that begin with 2 and differ only in the direction of the sort. When no direction is given, the sort is ascending:',
    sql: ["SELECT * FROM price WHERE price LIKE '2%' ORDER BY price;"],
    file: 'fig_8_14.png', num: '8.14', cap: 'Sorting with ORDER BY in the default (ascending) order.',
    after: 'The rows are listed from the lowest price, 220, to the highest, 250.',
  }),
  ...sqlTask({
    intro: 'DESC reverses the order, so the highest prices are listed first:',
    sql: ["SELECT * FROM price WHERE price LIKE '2%' ORDER BY price DESC;"],
    file: 'fig_8_15.png', num: '8.15', cap: 'Sorting in descending order.',
  }),
  ...sqlTask({
    intro: 'ASC requests ascending order explicitly and therefore produces the same order as the default:',
    sql: ["SELECT * FROM price WHERE price LIKE '2%' ORDER BY price ASC;"],
    file: 'fig_8_16.png', num: '8.16', cap: 'Sorting in ascending order.',
    after: [
      'Two further points apply to these queries. First, the rows with ids 1 and 2 have the same price, so their relative order is not guaranteed; adding a second sort key, as in `ORDER BY price, id`, would make the result fully predictable. Second, the guide prints the pattern in two of these statements as `\'2%.\'`, with a trailing period. That period is a typographical error: a pattern that ends in a period matches none of these prices and returns an empty set, so the pattern `\'2%\'` was used, as in the guide’s own screenshots.',
    ],
  }),

  h2('i. DISTINCT'),
  ...sqlTask({
    intro: 'DISTINCT removes duplicate rows from a result. The price column was selected first without it and then with it:',
    sql: ['SELECT price FROM Price;', 'SELECT DISTINCT price FROM Price;'],
    file: 'fig_8_17.png', num: '8.17', cap: 'Removing duplicate values with DISTINCT.',
    after: 'Without DISTINCT, four values are returned and 250 appears twice. With DISTINCT, each value appears only once: 250, 220 and 190.',
  }),

  h2('j. FROM'),
  ...sqlTask({
    intro: 'The FROM clause names the table, or tables, that a query reads from, and every SELECT in this report has used it. The two queries below read from the same table but return different columns:',
    sql: ['SELECT * FROM price;', 'SELECT price FROM Price;'],
    file: 'fig_8_18.png', num: '8.18', cap: 'Retrieving all columns and a single column with FROM.',
    after: '`SELECT * FROM price` returns every column of the price table, whereas naming a column instead of using the asterisk, as in `SELECT price FROM Price`, returns that column alone. As explained in the introduction, `price` and `Price` refer to the same table.',
  }),
];

const conclusion = [
  h1('Conclusion'),
  p('This assignment covered the path from a fresh, standalone installation of MariaDB to working with data entirely from the command line. The installer took care of the root password, the Windows service and the network port, and the MariaDB Command Prompt provided a ready-made environment for the command-line client. Data definition statements (CREATE DATABASE and CREATE TABLE) built the Demo database and its two tables, and SHOW and DESC confirmed their structure. Data manipulation statements then carried out the full CRUD cycle, while the WHERE, LIKE, ORDER BY, DISTINCT and FROM clauses showed how a query can filter, match, sort and de-duplicate its results.'),
  p('Two lessons stand out. First, UPDATE and DELETE should always be written with a precise WHERE clause, because without one they act on every row of the table. Second, names should be written consistently. The mixed use of Book and book works on Windows only because names are compared there without regard to case; on a Linux server, where table names are case-sensitive by default, the same statements would fail. Compared with XAMPP, which packages MariaDB together with Apache and PHP behind a control panel, the standalone installation offers more direct control over the server and is closer to the way MariaDB is installed and administered in practice.'),
];

/** APA reference entry with a hanging indent; a trailing URL becomes a live link. */
function reference(text, url) {
  const children = runs(text);
  if (url) {
    children.push(new ExternalHyperlink({ link: url, children: [new TextRun({ text: url, style: 'Hyperlink' })] }));
  }
  return new Paragraph({ children, indent: { left: 720, hanging: 720 }, spacing: { after: 160 } });
}

const references = [
  h1('References'),
  reference('MariaDB. (n.d.-a). {{Identifier case-sensitivity}}. ',
    'https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-case-sensitivity'),
  reference('MariaDB. (n.d.-b). {{Installing MariaDB MSI packages on Windows}}. ',
    'https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/installing-mariadb/binary-packages/installing-mariadb-msi-packages-on-windows'),
  reference('MariaDB. (n.d.-c). {{mariadb command-line client}}. ',
    'https://mariadb.com/docs/server/clients-and-utilities/mariadb-client/mariadb-command-line-client'),
  reference('MariaDB Foundation. (n.d.). {{Download MariaDB Server}}. Retrieved October 15, 2026, from ',
    'https://mariadb.org/download/'),
  reference('Walsh College. (2026). {{MariaDB guide}} [Course handout].'),
];

// ---------------------------------------------------------------- document

const doc = new Document({
  creator: 'Student',
  lastModifiedBy: 'Student',
  title: 'Comprehensive Assignment 1: MariaDB Setup and SQL Fundamentals',
  description: 'Week 3 comprehensive assignment: MariaDB installation and SQL fundamentals.',
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 22 },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO, after: 160 } },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 30, bold: true, color: NAVY },
        paragraph: {
          spacing: { before: 120, after: 200 },
          keepNext: true,
          keepLines: true,
          outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'B4C6E7', space: 4 } },
        },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 24, bold: true, color: BLUE },
        paragraph: { spacing: { before: 300, after: 100 }, keepNext: true, keepLines: true, outlineLevel: 1 },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, color: GREY })],
        })],
      }),
    },
    children: [
      ...titlePage,
      ...introduction,
      ...section1,
      ...section2,
      ...section3,
      ...section4,
      ...section5,
      ...section6,
      ...section7,
      ...section8,
      ...conclusion,
      ...references,
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log(`wrote ${OUT} (${buf.length} bytes)`);
});
