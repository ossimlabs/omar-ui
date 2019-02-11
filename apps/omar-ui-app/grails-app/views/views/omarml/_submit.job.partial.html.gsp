<div class="modal-header">
  <span><i class="fa fa-cog"></i>&nbsp;&nbsp;Run Detections</span>
</div>

<div class="modal-body" id="image-share-modal-input">
  Image DB ID:&nbsp;<input size="65" ng-model="vm.imageId" class="ng-pristine ng-valid ng-touched" autofocus readonly></input><br>

  Model:&nbsp;
  <ui-select
      class="form-control omar-sites-select"
      ng-model="vm.model"
      theme="bootstrap">
      <ui-select-match placeholder="Model">
          <div>{{$select.selected.name}}</div>
      </ui-select-match>
      <ui-select-choices repeat="model in vm.models.data">
          <div>
              <strong ng-bind="model.name"></strong>
          </div>
      </ui-select-choices>
  </ui-select>
  <br>

  Confidence:&nbsp;<input size="3" ng-model="vm.confidence" type="number" min="5" max="100" class="ng-pristine ng-valid ng-touched"></input><br>

  Non-Max Suppression:&nbsp;<input size="3" ng-model="vm.nms" type="number" min="5" max="100" class="ng-pristine ng-valid ng-touched"></input><br>
</div>

<div class="modal-footer">
  <button class="btn btn-warning" type="button" ng-click="vm.runJob()">Run Job</button>
  <button class="btn btn-warning" type="button" ng-click="vm.close()">Close</button>
</div>
