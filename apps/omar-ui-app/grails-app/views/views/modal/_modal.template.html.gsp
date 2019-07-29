<div class="modal-header">
    <h3 class="modal-title" id="modal-title">I'm a modal!</h3>
</div>
<div class="modal-body" id="modal-body">
    <ul>
        <li ng-repeat="item in $ctrl.items">
            <a href="#"></a>
        </li>
    </ul>
    $ctrl.modalData: <b>{{ $ctrl.modalData }}</b>
</div>
<div class="modal-footer">
    <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">OK</button>
    <button class="btn btn-warning" type="button" ng-click="$ctrl.cancel()">Cancel</button>
</div>