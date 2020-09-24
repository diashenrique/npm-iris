var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/api";

$(function () {
  var projectSelectBox = $("#projectSelection").dxSelectBox({
    dataSource: new DevExpress.data.DataSource({
      store: new DevExpress.data.CustomStore({
        byKey: function (args) {
          return $.getJSON(urlREST + "/project/lookup");
        },
        load: function (args) {
          return $.getJSON(urlREST + "/project/lookup");
        }
      })
    }),
    width: 300,
    valueExpr: "ID",
    displayExpr: "description",
    showClearButton: true,
    placeholder: "Choose a project ..."
    /*,
    onValueChanged: function (e) {
      if (!e.value) {
        formGeral.resetValues();
        formControle.resetValues();
        return;
      }
      $.getJSON(urlPreparacao, {
        method: "recPaciente",
        codPaciente: e.value
      }, function (retorno) {
        formGeral.option("formData", retorno.geral)
        formControle.option("formData", retorno.controle)
      });
    }*/
  }).dxSelectBox("instance");

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

  var dependenceStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/gantt/dependence");
    },
    insert: function (values) {
      values.ProjectId = 0;
      return $.ajax({
        url: urlREST + "/gantt/dependence",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/gantt/dependence/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: urlREST + "/gantt/dependence/" + encodeURIComponent(key),
        method: "DELETE"
      });
    }
  });

  var resourceStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/gantt/resource");
    }
  });

  var resourceAssignmentStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/gantt/resourceAssignments");
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/gantt/resource/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    }
  });

  var ganttIntance = $("#gantt").dxGantt({
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
      dataSource: dependenceStore,
      keyExpr: "ID",
      predecessorIdExpr: "PredecessorId",
      successorIdExpr: "SucessorId",
      typeExpr: "Type",
      projectExpr: "ProjectId"
    },
    resources: {
      dataSource: resourceStore,
      keyExpr: "ID",
      textExpr: "UserName"
    },
    resourceAssignments: {
      dataSource: resourceAssignmentStore,
      keyExpr: "ID",
      resourceIdExpr: "AssignedUser",
      taskIdExpr: "ID"
    },
    editing: {
      enabled: true
    },
    showResources: false,
    validation: {
      autoUpdateParentTasks: true
    },
    toolbar: {
      items: [
        "undo",
        "redo",
        "separator",
        "collapseAll",
        "expandAll",
        "separator",
        "addTask",
        "deleteTask",
        "separator",
        "zoomIn",
        "zoomOut",
        {
          widget: "dxButton",
          options: {
            stylingMode: "text",
            icon: "fas fa-user-tag",
            hint: "Show|Hide Task Resources",
            onClick: function (e) {
              var resourceStatus = ganttIntance.option("showResources");
              if (resourceStatus == false) {
                ganttIntance.option("showResources", true);
              } else {
                ganttIntance.option("showResources", false);
              }
            }
          }
        }
      ]
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
  }).dxGantt("instance");
});