// JavaScript version of tags.coffee
// Part of the CoffeeScript to JavaScript migration

// Directive to present the tags
myApp.directive('tags', ['$compile', '$timeout', function($compile, $timeout) {
  return {
    restrict: 'E',
    scope: {
      hideFilter: '@hideFilter',
      hideApply: '@hideApply',
      model: '@model',
      tagIds: '=tagIds'
    },
    link: function($scope, elem, attrs) {
      elem.click(function(event) {
        let clicked = true;
        if (!elem.data('clicked')) {
          elem.popover({
            html: true,
            placement: 'bottom',
            trigger: 'manual',
            content: '<div style="width: 200px; height: 100px">Hola</div>'
          });
          elem.popover('show');
          elem.data('clicked', true);
          const $cont = elem.data('popover').tip().find('.popover-content');
          // Compilation
          $cont.html(contHtml);

          // Modal dialog editor, hidden when created
          $timeout(function() {
            $compile($cont)($scope);

            $scope.editor = $cont.find('#tag-editor');
            $scope.editor.dialog({autoOpen: false, width: 350});
            $scope.$colorEditor = $scope.editor.find('#tag-bgcolor-input');
            $scope.$colorEditor.minicolors({
              defaultValue: '#efefef',
              change: function(event) {
                $scope.$colorEditor.trigger('change');
              }
            });
            $scope.model = attrs.model;
          });

          $scope.url = attrs.url;

          // Close when clicked outside popover
          $('body').on('click', function(evt) {
            // Prevent closing when editor open
            if ($scope.editor.dialog('isOpen')) return false;
            if (clicked || $(evt.target).parents('.ui-dialog').attr('aria-describedby') === 'tag-editor') return false;
            if (elem.data('clicked') && $(evt.target).parents('.popover').length === 0) {
              elem.data('popover').tip().hide();
            }
          });
        } else {
          if (elem.data('popover').tip().css('display') === 'block') {
            elem.data('popover').tip().hide();
          } else {
            elem.data('popover').tip().show();
          }
        }
        clicked = false;
      });
      // Add a class to see that there are selected tags
      if (attrs.tagIds !== 'false') {
        elem.find('.tags-button').addClass('btn-info');
      }
    },
    template: 
      '<a href="javascript:;" class="btn tags-button">' +
      '  <i class="icon-tags"></i>' +
      '  Etiquetas' +
      '  <i class="icon-caret-down"></i>' +
      '</a>'
  };
}]);

const htmlModal = 
  '<div id="tag-editor" style="background-color:#fff">' +
  '  <input id="model" type="hidden">' +
  '  <div class="control-group name ib {{errorCssFor(tag_name, \'tag_name\')}}">' +
  '    <input placeholder="nombre" id="tag-name-input" type="text" ng-model="tag_name" title="{{errors.tag_name}}">' +
  '    <span class="hint">Solo letras con espacios</span>' +
  '  </div>' +
  '  <div class="control-group bgcolor ib form-inline ">' +
  '    <input id="tag-bgcolor-input" placeholder="#ff0000" type="text" ng-model="tag_bgcolor" title="{{errors[\'tag_bgcolor\']}}">' +
  '  </div>' +
  '' +
  '  <button class="btn btn-primary b" ng-click="save()">{{editorBtn}}</button>' +
  '' +
  '  <div class="tag-preview">' +
  '    <span class="tag" style="background:{{tag_bgcolor}};color:{{color(tag_bgcolor)}}">{{tag_name}}</tag>' +
  '  </div>' +
  '  <div class="clearfix"></div>' +
  '  <ul class="tag-colors">' +
  '    <li ng-repeat="color in colors" ng-click="setColor(color)" style="background-color:{{color}}"></li>' +
  '  </ul>' +
  '  <div class="clearfix"></div>' +
  '</div>';

const contHtml = 
  '<div ng-controller="TagsController" class="tags-controller" ng-cloak>' +
  '  <input type="text" ng-model="search" class="search" placeholder="escriba para buscar" />' +
  '  <div class="tags-div">' +
  '    <ul class="unstyled tags-list">' +
  '      <li ng-repeat="tag in tags | filter:search">' +
  '        <i class="icon-pencil fs120" ng-click="editTag(tag, $index)" title="Editar"></i>' +
  '        &nbsp;' +
  '        <input type="checkbox" ng-click=\'markChecked(tag)\' ng-model=\'tag.checked\'></span>' +
  '        <span class=\'tag-item\' ng-click=\'markChecked(tag)\'' +
  '          style=\'background: {{ tag.bgcolor }};color: {{ color(tag.bgcolor) }}\'>{{ tag.name }}</span>' +
  '      </li>' +
  '    </ul>' +
  '  </div>' +
  '' +
  '  <div class=\'buttons\'>' +
  '    <button ng-disabled=\'!tagsAny("checked", true)\' ng-click="filter()" ng-hide="hideFilter" class=\'btn btn-success btn-small\'>Filtrar</button>' +
  '    <button class=\'btn btn-small\' ng-click=\'newTag()\'><i class="icon-plus-circle"></i> Nueva</button>' +
  '    <button ng-disabled=\'disableApply()\' class="btn btn-primary btn-small apply-tags" ng-click="applyTags()" ng-hide=\'hideApply\'>Aplicar</button>' +
  '  </div>' +
  '  <!--Modal dialog-->' +
  htmlModal +
  '</div>';

////////////////////////////////////
myApp.directive('tagsfor', function($compile, $timeout) {
  return {
    restrict: 'E',
    template: 
      '<div class="tags-for">' +
      '  <span ng-repeat="tag in tags track by $index" class="tag tag{{tag.id}}" style="background: {{tag.bgcolor}}; color: {{tag.color}}">' +
      '    {{tag.name}}' +
      '  </span>' +
      '</div>',
    require: '^ngModel',
    scope: {
      tagIds: '=tagIds'
    },
    controller: function($scope) {
      $scope.tagIds;
      $scope.tags = Plugins.Tag.getTagsById($scope.tagIds);
    }
  };
});
