<div class="modal-header">
  <span><i class="fa fa-cog"></i>&nbsp;&nbsp;Run Detections</span>
</div>

<div class="modal-body" id="image-share-modal-input">
  Image DB ID:&nbsp;<input size="65" ng-model="vm.imageId" class="ng-pristine ng-valid ng-touched" autofocus readonly></input><br>

  Model:&nbsp;

  <ui-select
      class="form-control omar-sites-select"
      ng-model="list.models"
      theme="bootstrap">
      <ui-select-match>
          <div>{{$select.selected.models.name}}</div>
      </ui-select-match>
      <ui-select-choices repeat="model in list.models">
          <div>
              <strong ng-bind="model.name"></strong>
          </div>
      </ui-select-choices>
  </ui-select>

  <br>

  Confidence:&nbsp;<input size="3" type="number" min="5" max="100" value="70" class="ng-pristine ng-valid ng-touched"></input><br>

  Non-Max Suppression:&nbsp;<input size="3" type="number" min="5" max="100" value="35" class="ng-pristine ng-valid ng-touched"></input><br>
</div>

<div class="modal-footer">
  <a class="btn btn-primary" ng-href="" target="_blank">
        <i class="fa fa-cog" style="cursor: pointer;"></i>&nbsp;Run Job&nbsp;&nbsp;
  </a>&nbsp;&nbsp;

  <button class="btn btn-warning" type="button" ng-click="vm.close()">Close</button>
</div>
