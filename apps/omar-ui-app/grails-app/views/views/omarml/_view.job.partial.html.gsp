<div class="modal-header">
  <span><i class="fa fa-cog"></i>&nbsp;&nbsp;View Jobs on {{vm.imageId}}</span>
</div>

<div class="modal-body" id="image-share-modal-input">
  <table style="width:100%">
    <tr>
      <th>Model</th>
      <th>Job ID</th>
      <th>Confidence</th>
      <th>Non-Max Suppression</th>
      <th>Status</th>
    </tr>
    <tr ng-repeat="job in vm.jobs.data">
      <td>{{job.jobModel}}</td>
      <td>{{job.jobid}}</td>
      <td>{{job.confidence}}</td>
      <td>{{job.nms}}</td>
      <td>{{job.jobStatus}}</td>
    </tr>
  </table>
</div>

<div class="modal-footer">
  <button class="btn btn-warning" type="button" ng-click="vm.backToSubmitJobs()">Back To Jobs</button>
  <button class="btn btn-warning" type="button" ng-click="vm.close()">Close</button>
</div>
