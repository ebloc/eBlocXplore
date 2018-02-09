$(document).ready(function () {
  $.get('/api/recentBlocks', function (result) {
    // console.log(`result: `, result);
    $('#recentBlocksTable').DataTable({
      data: result,
      columns: [
        { data: 'number' },
        { data: 'miner' },
        { data: 'timestamp' },
        { data: 'txCount' },
      ],
    });
  });
});
