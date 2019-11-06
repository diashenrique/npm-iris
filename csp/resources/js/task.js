var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/isproject/rest";
var idFormPopup;

$(document).ready(function() {
  var userStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function() {
      return $.getJSON(urlREST + "/task");
    },
    insert: function(values) {
      return $.ajax({
        url: urlREST + "/task",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function(key, values) {
      return $.ajax({
        url: urlREST + "/task/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function(key) {
      return $.ajax({
        url: urlREST + "/task/" + encodeURIComponent(key),
        method: "DELETE"
      });
    }
  });

  var lookupDataSource = {
    store: new DevExpress.data.CustomStore({
      key: "ID",
      loadMode: "raw",
      load: function() {
        return $.getJSON(urlREST + "/user/lookup");
      }
    }),
    sort: "userName"
  };

  var dataGrid = $("#formTask")
    .dxDataGrid({
      dataSource: userStore,
      repaintChangesOnly: true,
      showBorders: true,
      columnAutoWidth: true,
      showColumnLines: true,
      showRowLines: true,
      rowAlternationEnabled: true,
      editing: {
        refreshMode: "full",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        mode: "popup",
        popup: {
          title: "Add Task",
          showTitle: true,
          width: 800,
          height: 400,
          position: {
            my: "center",
            at: "center",
            of: window
          }
        },
        form: {
          items: [
            {
              itemType: "group",
              colCount: 2,
              colSpan: 2,
              items: [
                {
                  dataField: "TaskName",
                  validationRules: [
                    {
                      type: "required"
                    }
                  ]
                },
                {
                  dataField: "Status",
                  editorOptions: {
                    dataSource: [
                      {
                        id: 1,
                        name: "Not Started"
                      },
                      {
                        id: 2,
                        name: "In Progress"
                      },
                      {
                        id: 3,
                        name: "Deferred"
                      },
                      {
                        id: 4,
                        name: "Need Assistance"
                      },
                      {
                        id: 5,
                        name: "Completed"
                      }
                    ],
                    valueExpr: "name",
                    displayExpr: "name"
                  }
                },
                {
                  dataField: "StartDate",
                  dataType: "date"
                },
                {
                  dataField: "DueDate",
                  dataType: "date"
                },
                {
                  dataField: "Priority",
                  editorOptions: {
                    dataSource: [
                      {
                        id: 1,
                        name: "Normal"
                      },
                      {
                        id: 2,
                        name: "Low"
                      },
                      {
                        id: 3,
                        name: "Medium"
                      },
                      {
                        id: 4,
                        name: "High"
                      }
                    ],
                    valueExpr: "name",
                    displayExpr: "name"
                  }
                },
                {
                  dataField: "Progress",
                  dataType: "number"
                },
                {
                  dataField: "AssignedUser",
                  caption: "Assigned User",
                  lookup: {
                    dataSource: lookupDataSource,
                    valueExpr: "ID",
                    displayExpr: "userName"
                  }
                }
              ]
            }
          ]
        }
      },
      onEditorPreparing: function(e) {
        if (e.dataField === "Status" && e.parentType === "dataRow") {
          e.editorName = "dxSelectBox";
        }

        if (e.dataField === "Priority" && e.parentType === "dataRow") {
          e.editorName = "dxSelectBox";
        }

        if (e.dataField === "StartDate" && e.parentType === "dataRow") {
          e.editorOptions.max = e.row.data.DueDate;
        }

        if (e.dataField === "DueDate" && e.parentType === "dataRow") {
          e.editorOptions.min = e.row.data.StartDate;
        }
      },
      searchPanel: {
        visible: true,
        width: 300
      },
      paging: {
        pageSize: 15
      },
      columns: [
        {
          dataField: "ID",
          visible: false
        },
        {
          dataField: "TaskName",
          validationRules: [
            {
              type: "required"
            }
          ]
        },
        {
          dataField: "StartDate",
          dataType: "date"
        },
        {
          dataField: "DueDate",
          dataType: "date"
        },
        {
          dataField: "Progress",
          dataType: "number"
        },
        {
          dataField: "Priority",
          editorOptions: {
            dataSource: [
              {
                id: 1,
                name: "Normal"
              },
              {
                id: 2,
                name: "Low"
              },
              {
                id: 3,
                name: "Medium"
              },
              {
                id: 4,
                name: "High"
              }
            ],
            valueExpr: "name",
            displayExpr: "name"
          }
        },
        {
          dataField: "Status",
          editorOptions: {
            dataSource: [
              {
                id: 1,
                name: "Not Started"
              },
              {
                id: 2,
                name: "In Progress"
              },
              {
                id: 3,
                name: "Deferred"
              },
              {
                id: 4,
                name: "Need Assistance"
              },
              {
                id: 5,
                name: "Completed"
              }
            ],
            valueExpr: "name",
            displayExpr: "name"
          }
        },
        {
          dataField: "AssignedUser",
          caption: "Assigned User",
          lookup: {
            dataSource: lookupDataSource,
            valueExpr: "ID",
            displayExpr: "userName"
          }
        }
      ]
    })
    .dxDataGrid("instance");
});
