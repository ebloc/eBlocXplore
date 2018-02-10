var blocksTable; // datatables object

function blockClicked(blockNumber) { // eslint-disable-line no-unused-vars
  var currentBlocks = blocksTable.ajax.json().data;
  var block = currentBlocks.find(function (b) { return b.number === blockNumber; });
  // @TODO: handle this
  console.log('clicked block', block); // eslint-disable-line no-console
  return block;
}

function addressClicked(address) { // eslint-disable-line no-unused-vars
  // @TODO: handle this as well
  console.log('address clicked', address); // eslint-disable-line no-console
  return address;
}

function fillBlocksTable() {
  blocksTable = $('#recentBlocksTable').DataTable({
    serverSide: true,
    ajax: '/api/datatableBlocks',
    searching: false,
    order: [0, 'desc'],
    columns: [
      {
        title: 'Block',
        data: 'number',
        render: function (data, type, row) {
          var numString = $.fn.dataTable.render.number(',', '.').display(data, type, row);
          return '<a href="javascript:void(0)" onclick="blockClicked(' + data + ')">' + numString + '</a>';
        },
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
        className: 'ellipsis',
        render: function (data) {
          var truncated = data.slice(0, 20) + '...';
          return '<a href="javascript:void(0)" onclick="addressClicked(\'' + data + '\')">' + truncated + '</a>';
        },
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
