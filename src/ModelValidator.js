(function () {
    angular.module('angularModelValidator').service('ModelValidator', ModelValidator);

    function ModelValidator() {

        this.addRuleSet = addRuleSet;
        this.validate = validateRules;

        var validationRuleSets = [];

        function addRuleSet(model, rules) {
            validationRuleSets.push({ model: model, rules: rules });
        };

        function validateRules(model) {
            var ruleSet = getValidationRuleSet(model);
            return validate(model, ruleSet) || null;
        };

        function getValidationRuleSet(model) {
            for (var i = 0; i < validationRuleSets.length; i++) {
                if (validationRuleSets[i].model === model) {
                    return validationRuleSets[i].rules;
                }
            }
        };
    }

})();