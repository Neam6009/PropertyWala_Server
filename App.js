const {app}  = require("./server");

app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening at port  ${process.env.PORT || 4000}...`);
});


module.exports = app ;