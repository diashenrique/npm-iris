var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/rest";

$(function () {

  // Button Add Task
  $("#btnTaskResource").dxButton({
    icon: "fas fa-user-tag",
    hint: "Show|Hide Task Resources"
  });

  var ganttStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/gantt");
    },
    insert: function (values) {
      return $.ajax({
        url: urlREST + "/gantt",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/gantt/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: urlREST + "/gantt/" + encodeURIComponent(key),
        method: "DELETE"
      });
    }
  });

  $("#gantt").dxGantt({
    tasks: {
      dataSource: ganttStore,
      keyExpr: "ID",
      parentIdExpr: "ParentId",
      startExpr: "StartDate",
      endExpr: "DueDate",
      progressExpr: "Progress",
      titleExpr: "TaskName"
    },
    dependencies: {
      dataSource: ganttStore,
      keyExpr: "ID",
      predecessorIdExpr: "PredecessorId",
      successorIdExpr: "SucessorId"
    },
    editing: {
      enabled: true
    },
    columns: [{
        dataField: "TaskName",
        caption: "Subject",
        width: 200
      },
      {
        dataField: "StartDate",
        caption: "Start Date",
        width: 100
      },
      {
        dataField: "DueDate",
        caption: "Due Date",
        width: 100
      },
      {
        dataField: "Status",
        width: 150
      }
    ],
    scaleType: "weeks",
    taskListWidth: 550
  });
});