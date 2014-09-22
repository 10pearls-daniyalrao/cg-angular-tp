angular.module('<%= appname %>').controller('<%= ctrlname %>',function($scope){

  $scope.showIndex = true;
  $scope.current<%= resource_cap %> = {<%= fields %>};
  $scope.page = {current:1,total_items:0,items_per_page:20};
  $scope.isEditing = false;

  <%= resource %>Service.query({page:$scope.page.current},function(data){
    $scope.<%= resource_pluralize %> = data.<%= resource_pluralize %>;
    $scope.page.total_items = data.count;
  });

  $scope.pageChanged = function(page){
      <%= resource %>Service.query({page:page,per_page:$scope.page.items_per_page},function(data){
      $scope.<%= resource_pluralize %> = data.<%= resource_pluralize %>;
    });
  }

  $scope.new<%= resource_cap %>Form = function(){
    $scope.showIndex = false;
  };

  $scope.create<%= resource_cap %> = function(<%= resource %>){
    $scope.showIndex = true;
    $scope.isEditing = false;
    <%= resource %>Service.save(<%= resource %>,function(res){
      console.log("success");
      console.log(res);
    },function(res){
      console.log("error");
      console.log(res);
    });
    $scope.<%= resource_pluralize %>.push(<%= resource %>);
  };
  $scope.update<%= resource_cap %> = function(<%= resource %>){
    <%= resource %>Service.update({id:<%= resource %>.id},<%= resource %>);
    $scope.showIndex = true;
    $scope.isEditing = false;
  };

  $scope.edit<%= resource_cap %>Form = function(<%= resource %>){
    $scope.showIndex = false;
    $scope.isEditing = true;
    $scope.current<%= resource_cap %> = <%= resource %>;
  };

  $scope.cancel<%= resource_cap %>Form = function(){
    $scope.showIndex = true;
    $scope.new<%= resource %> = {<%= fields %>};
  };

  $scope.submitForm = function() {
  };
  
});