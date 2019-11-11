$(function() {
  // Checking Current Theme
  console.log(Looper.skin);
  if (Looper.skin === "dark") {
    DevExpress.ui.themes.current("generic.dark");
  } else {
    DevExpress.ui.themes.current("generic.light");
  }
});
