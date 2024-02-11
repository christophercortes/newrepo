const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error); // writes the error
  }
}

/* ****************************
 * Get inventory item detail view
 * ****************************/
async function getDetailsByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getdetailsbyinventoryid error" + error);
  }
}

/* ************************
 * Insert a New Inventory Item
 * ************************/

async function getAddInventoryId(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO classification 
	(classification_name)
VALUES
	(${classification_name})`
    );
    return data.rows;
  } catch (error) {
    console.error("getdetailsbyaddinventoryid" + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getDetailsByInventoryId,
  getAddInventoryId,
};
