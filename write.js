import sqlite3 from "sqlite3";
import fs from "fs";

function writeUserData(table, data) {
  const db = getDatabase(app);
  return set(ref(db, `${table}`), data);
}

//Open the databse connection
let db = new sqlite3.Database("./quranOne.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the Quran One database.");
});

let database = {};
//Get the data
db.serialize(async () => {
  try {
    let tables = await getTableNames();
    console.log(tables);
    tables.map(async (item, index) => {
      try {
        let tableData = await getTableData(item);
        let name = tables[index];

        if (
          item === "bayanthanvi" ||
          item === "fahmulquran" ||
          item === "fahmulquranintro" ||
          item === "fizilalalquran" ||
          item === "fizilalalquranintro" ||
          item === "ibneabbas" ||
          item === "ibnekaseer" ||
          item === "jalalain" ||
          item === "jawahirulquran" ||
          item === "maarifulquran" ||
          item === "maarifulqurankandhelvi" ||
          item === "majidi" ||
          item === "mazhari" ||
          item === "ruhulquranintro" ||
          item === "surah" ||
          item === "tadabburintro" ||
          item === "tafheemulquranintro" ||
          item === "tafseername" ||
          item === "usmani" ||
          item === "aasanquran" ||
          item === "aasanquranintro" ||
          item === "ahsanulbayan" ||
          item === "android_metadata" ||
          item === "anwarulbayan" ||
          item === "bayanisrar" ||
          item === "bayanisrarintro"
        ) {
        } else database = { ...database, [name]: tableData };
      } catch (e) {
        console.log(e);
      }
    });
    closeConnection();
  } catch (e) {
    console.log(e);
    closeConnection();
  }
});

//Close the Database connection
function closeConnection() {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    // fs.writeFile("data.json", JSON.stringify(database), (err) => {
    //   if (err) console.log(err);
    //   else console.log("Data written to file");
    // });
    // console.log(database);
    console.log("Close the database connection.");
  });
}

//Read Data from a table
function getTableData(tableName) {
  let tableData = new Promise((resolve, reject) => {
    let data = [];
    db.each(
      `SELECT * FROM ${tableName}`,
      async (err, row) => {
        if (err) {
          let message = `Error Occurred ${err.message}`;
          console.log(message);
          reject(message);
        }
        data.push(row);
      },
      async (err, count) => {
        if (err) {
          let message = `Completion Error: ${err.message}`;
          console.log(message);
          reject(message);
        }

        console.log(`Total Table Count: ${count}`);

        resolve(data);
      }
    );
  });
  return tableData;
}

//Return a promise which will resolve to the array of all the names of tables in the database
function getTableNames() {
  let tables = new Promise((resolve, reject) => {
    let tableNames = [];
    db.each(
      "SELECT name FROM sqlite_schema WHERE type='table'",
      (err, row) => {
        if (err) {
          let message = `Error Occurred ${err.message}`;
          console.log(message);
          reject(message);
        }
        tableNames.push(row.name);
      },
      (err, count) => {
        if (err) {
          let message = `Completion Error: ${err.message}`;
          console.log(message);
          reject(message);
        }

        console.log(`Total Tables Count: ${count}`);
        resolve(tableNames);
      }
    );
  });
  return tables;
}
