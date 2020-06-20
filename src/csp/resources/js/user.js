var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/api";

$(document).ready(function () {
  var userStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/user");
    },
    insert: function (values) {
      return $.ajax({
        url: urlREST + "/user",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/user/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: urlREST + "/user/" + encodeURIComponent(key),
        method: "DELETE"
      });
    }
  });

  var dataGrid = $("#formUser")
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
          title: "User Info",
          showTitle: true,
          width: 800,
          height: 450,
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
            items: [
              "UserName",
              "Name",
              "Company",
              "JobTitle",
              "email",
              "DateOfBirth",
              {
                colSpan: 2,
                dataField: "ProfileHeading",
                editorType: "dxTextArea",
                editorOptions: {
                  placeholder: "Add notes..."
                }
              },
              {
                dataField: "Active",
                colSpan: 2
              }
            ]
          }]
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
          dataField: "UserName",
          validationRules: [{
            type: "required"
          }]
        },
        {
          dataField: "Name",
          validationRules: [{
            type: "required"
          }]
        },
        {
          dataField: "email",
          validationRules: [{
              type: "required"
            },
            {
              type: "email"
            }
          ]
        },
        {
          dataField: "DateOfBirth",
          dataType: "date",
          validationRules: [{
            type: "required"
          }]
        },
        {
          dataField: "JobTitle"
        },
        {
          dataField: "Company"
        },
        {
          dataField: "ProfileHeading"
        },
        {
          dataField: "Active",
          dataType: "boolean"
        }
      ]
    })
    .dxDataGrid("instance");
});