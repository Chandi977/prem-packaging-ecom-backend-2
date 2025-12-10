const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).send('OK');
});
// comment added

module.exports = router;
