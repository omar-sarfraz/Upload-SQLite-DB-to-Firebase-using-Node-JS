import sqlite3 from "sqlite3";
import app from "./firebase.js";
import { getDatabase, ref, set, get, child } from "firebase/database";

function writeUserData(table, data) {
  const db = getDatabase(app);
  return set(ref(db, `${table}`), data);
}

function getTable(table) {
  const dbRef = ref(getDatabase(app));
  return get(child(dbRef, table))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

let time = 0;
let sent = 0;

//Open the databse connection
let db = new sqlite3.Database("./quranOne.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the Quran One database.");
});

//Get the data
db.serialize(async () => {
  try {
    let tables = await getTableNames();
    console.log(tables);
    tables.map(async (item, index) => {
      try {
        let tableData = await getTableData(item);
        // let name = tables[index];
        // database.push({ [name]: tableData });
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

        //time = time + 60000;
        console.log(`Total Table Count: ${count}`);
        try {
          let exist = await getTable(tableName);
          if (!exist) {
            //console.log(`Sending table ${tableName}`);
            await writeUserData(tableName, data);
            console.log(`${tableName} sent to firebase ${sent}`);
            sent++;

            // setTimeout(async () => {
            //   console.log(`Sending table ${tableName}`);
            //   await writeUserData(tableName, data);
            //   console.log(`${tableName} sent to firebase`);
            // }, time);
          } else {
            console.log(`${tableName} already exist`);
          }
        } catch (e) {
          console.log(e.message);
        }

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
