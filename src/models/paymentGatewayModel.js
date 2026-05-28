import connection from "../config/connectDB.js";

const paymentGatewayModel = {
  // Get all payment gateways
  getAll: async () => {
    const [rows] = await connection.execute(
      "SELECT * FROM new_payment_gateways ORDER BY id DESC",
    );
    return rows;
  },

  // Get all active payment gateways
  getActive: async () => {
    const [rows] = await connection.execute(
      "SELECT * FROM new_payment_gateways WHERE is_active = 1 ORDER BY id DESC",
    );
    return rows;
  },

  // Get a payment gateway by ID
  getById: async (id) => {
    const [rows] = await connection.execute(
      "SELECT * FROM new_payment_gateways WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  // Create a new payment gateway
  create: async (data) => {
    const {
      pay_name,
      min_price,
      max_price,
      bonus_percent,
      recharge_amounts,
      gift_amounts,
      is_active = 1,
    } = data;

    const [result] = await connection.execute(
      `INSERT INTO new_payment_gateways (pay_name, min_price, max_price, bonus_percent, recharge_amounts, gift_amounts, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        pay_name,
        min_price,
        max_price,
        bonus_percent,
        recharge_amounts,
        gift_amounts,
        is_active,
      ],
    );

    return result;
  },

  // Update a payment gateway
  update: async (id, data) => {
    const {
      pay_name,
      min_price,
      max_price,
      bonus_percent,
      recharge_amounts,
      gift_amounts,
      is_active,
    } = data;

    const [result] = await connection.execute(
      `UPDATE payment_gateways 
       SET pay_name = ?, min_price = ?, max_price = ?, bonus_percent = ?, recharge_amounts = ?, gift_amounts = ?, is_active = ?
       WHERE id = ?`,
      [
        pay_name,
        min_price,
        max_price,
        bonus_percent,
        recharge_amounts,
        gift_amounts,
        is_active,
        id,
      ],
    );

    return result;
  },

  // Delete a payment gateway
  delete: async (id) => {
    const [result] = await connection.execute(
      "DELETE FROM payment_gateways WHERE id = ?",
      [id],
    );
    return result;
  },

  // Toggle active status
  toggleActive: async (id) => {
    const [result] = await connection.execute(
      "UPDATE payment_gateways SET is_active = NOT is_active WHERE id = ?",
      [id],
    );
    return result;
  },
};

export default paymentGatewayModel;
