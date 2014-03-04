// main.js


'use strict';

var app = angular.module('myApp', ['ngGrid','ui.bootstrap']);

app.service('sharedProperties',function(){
  var allData =    [{"name": "王二", "age": 32, "birthday": "Aug 3, 1978", "salary": 6000},
                    {"name": "李狗", "age": 25, "birthday": "Aug 3, 1988", "salary": 6000},
                    { "name": "Moroni", "age": 50, "birthday": "Oct 28, 1970", "salary": 5000},
                    { "name": "Moris", "age": 43, "birthday": "Oct 28, 1970", "salary": 5000},
                    { "name": "Nicolas", "age": 42, "birthday": "Oct 28, 1970", "salary": 5000},
                    { "name": "Tiancum", "age": 43, "birthday": "Feb 12, 1985", "salary": 70000},
                    { "name": "Jacob", "age": 27, "birthday": "Aug 23, 1983", "salary": 40000},
                    { "name": "Nephi", "age": 29, "birthday": "May 31, 2010", "salary": 50000 },
                    { "name": "Enos", "age": 34, "birthday": "Aug 3, 2008", "salary": 30000 }]; 
  return {
    getAllData : function(){
      return allData;
    },
    setAllData : function(val){
      allData = val;
    }
  }
})


app.controller("MyCtrl4",function($scope, $timeout, sharedProperties){
 
  $scope.mySelections = [];
  $scope.myData = [];
  $scope.watchAdd = sharedProperties.getAllData();

  setInterval(function(){$scope.watchAdd = sharedProperties.getAllData()},500);

  $scope.total_salary = function(){
    var total_s = 0,data=$scope.myData;
    for(var i=0;i<data.length;i++){
      total_s += parseInt(data[i].salary);
    }
    return total_s
  };

  $scope.deleteSelected = function() {
    angular.forEach($scope.mySelections, function(rowItem) { 
        $scope.watchAdd.splice($scope.watchAdd.indexOf(rowItem),1);
      });
    // sharedProperties.setAllData($scope.myData);
    $scope.addAlert({type: 'danger', msg: "成功删除"+$scope.mySelections.length+"项"});
    $scope.gridOptions.selectAll(false);
  };

  $scope.clearInput = function(){
    $scope.name = null;
    $scope.age = null;
    $scope.title = null;
  };

  $scope.save = function(){
    // $http.post('jsonFiles/register.json', $scope.myData);
    $scope.addAlert({type: 'success', msg: "保存成功"})
  };

  $scope.alerts = [];

  $scope.addAlert = function(msg) {
    $scope.alerts.push(msg);
    $timeout($scope.closeAlert,2000)
  };

  $scope.closeAlert = function(index) {
    index = index || 0 ; 
    $scope.alerts.splice(index, 1);
  }; 
// ---------------------------paging----------------------------------------------
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: false
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data = sharedProperties.getAllData();
            if (searchText) {
                var ft = searchText.toLowerCase();
                data = data.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                $scope.setPagingData(data,page,pageSize);
            } else {
                $scope.setPagingData(data,page,pageSize);
            }
        }, 100);
    };
    


    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
  
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.$watch('watchAdd', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
      data: 'myData',
      enableCellSelection: true,
      enablePaging: true,
      selectedItems : $scope.mySelections,
      showSelectionCheckbox : true,
      selectWithCheckboxOnly: true,
      enableCellEdit: true,
      showFooter: true,
      showFilter: true,
      showColumnMenu: true,
      columnDefs: [{ field: "name", enableCellEdit: false},
                      { field: "age", cellFilter: 'number'},
                      { field: "birthday", cellFilter: 'date'},
                      { field: "salary", cellFilter: 'currency'}],
      totalServerItems: $scope.testGrid,
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions
    };
});

app.controller('ModalCtrl', function($scope,$modal,$log){
  $scope.Val = "subval";
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

});

app.controller('ModalInstanceCtrl',function($scope, $modalInstance, items, sharedProperties){
  $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      var data = sharedProperties.getAllData();
      data.unshift({name: $scope.name, age: $scope.age, birthday: $scope.birthday, salary: $scope.salary});
      sharedProperties.setAllData(data);
      // $parent.addAlert({type: 'success', msg: "成功添加职员："+$scope.name})
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
});