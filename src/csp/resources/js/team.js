var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/api";
var idFormPopup;

$(document).ready(function () {
  var userStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/team");
    },
    insert: function (values) {
      return $.ajax({
        url: urlREST + "/team",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/team/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: urlREST + "/team/" + encodeURIComponent(key),
        method: "DELETE"
      });
    }
  });

  var lookupDataSource = {
    store: new DevExpress.data.CustomStore({
      key: "ID",
      loadMode: "raw",
      load: function () {
        return $.getJSON(urlREST + "/user/lookup");
      }
    }),
    sort: "userName"
  };

  var dataGrid = $("#formTeam")
    .dxDataGrid({
      dataSource: userStore,
      repaintChangesOnly: true,
      showBorders: true,
      editing: {
        refreshMode: "full",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        mode: "popup",
        popup: {
          title: "Team Info",
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
              dataField: "TeamName"
            },
            {
              dataField: "Active",
              dataType: "boolean"
            },
            {
              dataField: "Description",
              colSpan: 2
            },
            {
              itemType: "group",
              caption: "Team Members",
              items: [{
                dataField: "MemberID",
                colSpan: 2,
                calculateDisplayValue: function (rowData) {
                  var texts = [];
                  if (rowData.MemberID && rowData.MemberID.length) {
                    for (var i = 0; i < rowData.MemberID.length; i++) {
                      var value = rowData.MemberID[i];
                      var displayText = states.filter(function (item) {
                        return item.ID == value;
                      })[0].Name;
                      if (displayText) texts.push(displayText);
                    }
                  }
                  return texts.toString();
                },
                caption: "Team Member",
                lookup: {
                  dataSource: {
                    store: new DevExpress.data.CustomStore({
                      key: "ID",
                      loadMode: "raw",
                      load: function () {
                        return sendRequest(urlREST + "/user/lookup");
                      }
                    })
                  },
                  valueExpr: "ID",
                  displayExpr: "userName"
                }
              }]
            }
          ]
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
          dataField: "TeamName",
          validationRules: [{
            type: "required"
          }]
        },
        {
          dataField: "Description",
          validationRules: [{
            type: "required"
          }]
        },
        {
          dataField: "Active",
          dataType: "boolean"
        },
        {
          dataField: "MemberID",
          width: 350,
          calculateDisplayValue: function (rowData) {
            var texts = [];
            if (rowData.MemberID && rowData.MemberID.length) {
              for (var i = 0; i < rowData.MemberID.length; i++) {
                var value = rowData.MemberID[i];
                var displayText = states.filter(function (item) {
                  return item.ID == value;
                })[0].Name;
                if (displayText) texts.push(displayText);
              }
            }
            return texts.toString();
          },
          caption: "Team Member",
          colSpan: 2,
          lookup: {
            dataSource: {
              store: new DevExpress.data.CustomStore({
                key: "ID",
                loadMode: "raw",
                load: function () {
                  return sendRequest(urlREST + "/user/lookup");
                }
              })
            },
            valueExpr: "ID",
            displayExpr: "userName"
          },
        }
      ],
      onEditorPreparing: function (e) {
        if (e.dataField == "MemberID" && e.parentType == "dataRow") {
          e.editorName = "dxDropDownBox";
          e.editorOptions.dropDownOptions = {
            height: 500,
            width: 800
          };
          e.editorOptions.contentTemplate = function (args, container) {
            var value = args.component.option("value"),
              $dataGrid = $("<div>").dxDataGrid({
                width: "100%",
                dataSource: args.component.option("dataSource"),
                keyExpr: "ID",
                hoverStateEnabled: true,
                paging: {
                  enabled: true,
                  pageSize: 10
                },
                filterRow: {
                  visible: true
                },
                scrolling: {
                  mode: "infinite"
                },
                height: "90%",
                showRowLines: true,
                showBorders: true,
                selection: {
                  mode: "multiple"
                },
                selectedRowKeys: value,
                onSelectionChanged: function (selectedItems) {
                  var keys = selectedItems.selectedRowKeys;
                  args.component.option("value", keys);
                }
              });

            var dataGrid = $dataGrid.dxDataGrid("instance");

            args.component.on("valueChanged", function (args) {
              var value = args.value;
              dataGrid.selectRows(value, false);
            });
            container.append($dataGrid);
            $("<div>")
              .dxButton({
                text: "Close",

                onClick: function (ev) {
                  args.component.close();
                }
              })
              .css({
                float: "right",
                marginTop: "10px"
              })
              .appendTo(container);
            return container;
          };
        }
      }
    })
    .dxDataGrid("instance");
});