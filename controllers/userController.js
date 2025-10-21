async function getHome(req, res) {
  res.json({
    message: "Des trucs",
  });
}

module.exports = {
  getHome,
};
