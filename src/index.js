import angular from "angular";
import '@uirouter/angularjs'
import "angular-mocks";

export const uirouterScenario = {
    build : () => inject(($compile, $rootScope) => {
        const componentDOMelement = angular.element("<div ui-view></div>");
        document.body.appendChild(componentDOMelement[0]);
        $compile(componentDOMelement)($rootScope.$new());
    }),
    clean: () => inject(() => {
        const bodyContent = document.body.querySelector("*");
        if(bodyContent) {
            bodyContent.remove();
        }
    }),
    loadState: ({ stateName, backend }) => inject(($rootScope, $httpBackend, $state) => {
        if(backend) {
            for(let methodName in backend) {
                $httpBackend
                    .when(methodName.toUpperCase(), backend[methodName].url)
                    .respond(backend[methodName].response)
            }
        }
        if($state.href(stateName)) {
            $state.go(stateName);
            backend ? $httpBackend.flush() : $rootScope.$digest();
        } else {
            throw new Error(`The given state "${stateName}" is not exists.`)
        }
    }),
    getFormFromState: (formName) => {
        const formElement = document.body.querySelector("form");
        if(formElement) {
            return angular.element(formElement).scope().$ctrl[formName];
        } else {
            throw new Error(`The actual state doesn't have a form.`)
        }
    }
};
