const pool = require('../config/db');

async function getUserAddresses(userId) {
  const result = await pool.query(
    `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, address_id ASC`,
    [userId]
  );
  return result.rows;
}

async function createAddress(userId, data) {
  const { street, area, district, division, postal_code, is_default } = data;

  // If new address is default, unset existing default first
  if (is_default) {
    await pool.query(
      `UPDATE addresses SET is_default = false WHERE user_id = $1`,
      [userId]
    );
  }

  const result = await pool.query(
    `INSERT INTO addresses (user_id, street, area, district, division, postal_code, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, street, area || null, district || null, division || null, postal_code || null, is_default || false]
  );
  return result.rows[0];
}

async function setDefaultAddress(userId, addressId) {
  await pool.query(`UPDATE addresses SET is_default = false WHERE user_id = $1`, [userId]);
  const result = await pool.query(
    `UPDATE addresses SET is_default = true WHERE address_id = $1 AND user_id = $2 RETURNING *`,
    [addressId, userId]
  );
  if (!result.rows.length) throw { status: 404, message: 'Address not found' };
  return result.rows[0];
}

async function deleteAddress(userId, addressId) {
  await pool.query(
    `DELETE FROM addresses WHERE address_id = $1 AND user_id = $2`,
    [addressId, userId]
  );
}

module.exports = { getUserAddresses, createAddress, setDefaultAddress, deleteAddress };
