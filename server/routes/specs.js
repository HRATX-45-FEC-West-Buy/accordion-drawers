const Router = require("express-promise-router");

const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const key_specs = await db.query({
    text:
      "SELECT id AS spec_id, spec_name, spec_value, has_more_info, more_info_text FROM specifications WHERE product_id = $1 AND spec_category = 'Key Specs'",
    values: [id]
  });
  const general = await db.query({
    text:
      "SELECT id AS spec_id, spec_name, spec_value, has_more_info, more_info_text FROM specifications WHERE product_id = $1 AND spec_category = 'General'",
    values: [id]
  });
  const warranty = await db.query({
    text:
      "SELECT id AS spec_id, spec_name, spec_value, has_more_info, more_info_text FROM specifications WHERE product_id = $1 AND spec_category = 'Warranty'",
    values: [id]
  });
  const other = await db.query({
    text:
      "SELECT id AS spec_id, spec_name, spec_value, has_more_info, more_info_text FROM specifications WHERE product_id = $1 AND spec_category = 'Other'",
    values: [id]
  });

  const specs = { product_id: id, key_specs: key_specs.rows, general: general.rows, warranty: warranty.rows, other: other.rows};
  res.send(specs);
});
