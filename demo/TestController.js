(function () {

    angular.module('angularModelValidator').controller('TestController', TestController);

    TestController.$inject = ['TestModel', '$scope'];

    function TestController(TestModel, $scope) {
        this.model = TestModel;
        this.submit = submit;

        function submit() {
            console.log("Submitted");
        };
    }

})();