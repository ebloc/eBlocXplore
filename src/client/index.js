function fillBlocksTable() {
  $('#recentBlocksTable').DataTable({
    serverSide: true,
    ajax: '/api/datatableBlocks',
    searching: false,
    order: [0, 'desc'],
    columns: [
      // block index
      {
        title: 'Block',
        data: 'number',
        render: $.fn.dataTable.render.number(',', '.'),
      }, {
        title: 'Time',
        data: 'timestamp',
        orderable: false,
        render: function (data) {
          return (new Date(data * 1000)).toLocaleString();
        },
      }, {
        title: 'TXN',
        data: 'transactions.length',
        orderable: false,
      },
      {
        title: 'Miner',
        data: 'miner',
        orderable: false,
      }, {
        title: 'Gas used',
        data: 'gasUsed',
        orderable: false,
        render: function (data, type, row) {
          // how much of gas limit is used
          var percent = (data / row.gasLimit) * 100;
          // format gasUsed integer
          var numString = $.fn.dataTable.render.number(',', '.').display(data, type, row);
          return numString + ' (' + percent.toFixed(2) + '%)';
        },
      }, {
        title: 'Gas limit',
        data: 'gasLimit',
        orderable: false,
        render: $.fn.dataTable.render.number(',', '.'),
      },
      // { data: null }, // @TODO: avg gas price
      // { data: null }, // @TODO: reward
      {
        title: 'Uncles',
        data: 'uncles.length',
        orderable: false,
      },
    ],
  });
}

$(document).ready(fillBlocksTable);
