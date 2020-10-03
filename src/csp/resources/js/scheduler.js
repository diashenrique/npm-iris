var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/api";

$(document).ready(function () {
  var calendarStore = new DevExpress.data.DataSource({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/scheduler");
    },
    insert: function (values) {
      return $.ajax({
        url: urlREST + "/scheduler",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/scheduler/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: urlREST + "/scheduler/" + encodeURIComponent(key),
        method: "DELETE"
      });
    }
  });

  var dataCalendar = $("#formScheduler").dxScheduler({
    dataSource: calendarStore,
    views: ["week", "month", "agenda"],
    currentView: "month",
    currentDate: new Date(),
    startDayHour: 9,
    height: 650
  });


});