(function () {

    angular.module('angularModelValidator').factory('TestModel', TestModel);

    TestModel.$inject = ['ModelValidator'];

    function TestModel(ModelValidator) {
        var model = {
            Name: "John",
            DateOfBirth: "24/02/1974",
            NumberOfChildren:  2
        };

        var ruleSet = {
            Name: { presence: true },
            DateOfBirth: { presence: true, date: true },
            NumberOfChildren: { presence: true, numericality: { onlyInteger: true, greaterThan: 0 } }
        }

        ModelValidator.addRuleSet(model, ruleSet);

        return model;
    }

})();