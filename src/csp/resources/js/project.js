var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/api";

$(document).ready(function () {
  var userStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/project");
    },
    insert: function (values) {
      return $.ajax({
        url: urlREST + "/project",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/project/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: urlREST + "/project/" + encodeURIComponent(key),
        method: "DELETE"
      });
    }
  });

  var dataGrid = $("#formProject")
    .dxDataGrid({
      dataSource: userStore,
      repaintChangesOnly: true,
      showBorders: true,
      editing: {
        refreshMode: "full",
        mode: "popup",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        popup: {
          title: "Project Info",
          showTitle: true,
          width: 800,
          height: 500,
          position: {
            my: "center",
            at: "center",
            of: window
          }
        },
        form: {
          items: [{
            itemType: "group",
            colCount: 2,
            colSpan: 2,
            items: [{
                dataField: "Code",
                validationRules: [{
                  type: "required"
                }]
              },
              {
                dataField: "Status",
                editorOptions: {
                  dataSource: [{
                      id: 1,
                      name: "Backlog"
                    },
                    {
                      id: 2,
                      name: "To-Do"
                    },
                    {
                      id: 3,
                      name: "In-Progress"
                    },
                    {
                      id: 4,
                      name: "Done"
                    },
                    {
                      id: 5,
                      name: "Accepted"
                    }
                  ],
                  valueExpr: "name",
                  displayExpr: "name"
                },
                validationRules: [{
                  type: "required"
                }]
              },
              {
                dataField: "Description",
                colSpan: 2,
                validationRules: [{
                  type: "required"
                }]
              },
              {
                dataField: "BeginDate",
                dataType: "date"
              },
              {
                dataField: "EndDate",
                dataType: "date"
              },
              {
                dataField: "DailyHours",
                caption: "Daily Working Hours",
                dataType: "number"
              },
              {
                dataField: "Remarks",
                colSpan: 2,
                editorType: "dxTextArea",
                editorOptions: {
                  placeholder: "Add notes..."
                }
              }
            ]
          }]
        }
      },
      onEditorPreparing: function (e) {
        if (e.dataField == "Status" && e.parentType == "dataRow") {
          e.editorName = "dxSelectBox";
        }

        if (e.dataField === "BeginDate" && e.parentType === "dataRow") {
          e.editorOptions.max = e.row.data.EndDate;
        }

        if (e.dataField === "EndDate" && e.parentType === "dataRow") {
          e.editorOptions.min = e.row.data.BeginDate;
        }
      },
      searchPanel: {
        visible: true,
        width: 300
      },
      paging: {
        pageSize: 15
      },
      columns: [{
          dataField: "ID",
          visible: false
        },
        {
          dataField: "Code"
        },
        {
          dataField: "Description"
        },
        {
          dataField: "Status"
        },
        {
          dataField: "BeginDate",
          dataType: "date"
        },
        {
          dataField: "EndDate",
          dataType: "date"
        },
        {
          dataField: "DailyHours",
          caption: "Daily Working Hours",
          dataType: "number"
        },
        {
          dataField: "Remarks"
        }
      ],
      onInitNewRow: function (e) {
        e.data.Status = "Backlog";
        e.data.DailyHours = 8;
      }
    })
    .dxDataGrid("instance");
});