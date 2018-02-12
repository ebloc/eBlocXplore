// datatable objects
var blocksTable;
var txTable; // eslint-disable-line no-unused-vars

/**
 * get element HTML string for address
 * @param  {string} address|
 * @param  {number} truncatedLength do not truncate if undefined (undefined)
 * @return {string}                 html string
 */
function getAddressLink(address, truncatedLength) {
  if (!address) address = ''; // @TODO: handle when address is empty
  var truncated = address;
  if (truncatedLength) truncated = address.slice(0, truncatedLength) + '...';
  return '<a href="javascript:void(0)" onclick="addressClicked(\'' + address + '\')">' + truncated + '</a>';
}

/**
 * get element HTML string for tx
 * @param  {string} address|
 * @param  {number} truncatedLength do not truncate if undefined (undefined)
 * @return {string}                 html string
 */
function getTxLink(hash, truncatedLength) {
  var truncated = hash;
  if (truncatedLength) truncated = hash.slice(0, truncatedLength) + '...';
  return '<a href="javascript:void(0)" onclick="txClicked(\'' + hash + '\')">' + truncated + '</a>';
}

function openBlockModal(block) {
  // const visualBlock = JSON.parse(JSON.stringify(block));
  block.time = (new Date(block.timestamp * 1000)).toLocaleString();
  block.minerHTML = getAddressLink(block.miner);
  block.parentHashHTML = getTxLink(block.parentHash);

  $('#blockModal [data-header]')[0].insertAdjacentText('beforeend', block.number);
  $('#blockModal td[data-property]').each(function (i, el) {
    var property = el.getAttribute('data-property');
    // var value = block[property];
    el.insertAdjacentHTML('afterbegin', block[property]);
    // console.log(`el: `, el);
    // console.log(`el.getAttribute('data-property'): `, el.getAttribute('data-property'));
    // console.log(`el.text(): `, el.text());
  });
  $('#blockModal').modal('show');
}

function blockClicked(blockNumber) { // eslint-disable-line no-unused-vars
  var currentBlocks = blocksTable.ajax.json().data;
  var block = currentBlocks.find(function (b) { return b.number === blockNumber; });
  openBlockModal(block);
  console.log('clicked block', block); // eslint-disable-line no-console
  return block;
}

function addressClicked(address) { // eslint-disable-line no-unused-vars
  // @TODO: handle this as well
  console.log('address clicked', address); // eslint-disable-line no-console
  return address;
}

function txClicked(hash) { // eslint-disable-line no-unused-vars
  // @TODO: handle this as well
  console.log('tx clicked', hash); // eslint-disable-line no-console
  return hash;
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
        render: function (data) { return getAddressLink(data, 20); },
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

function fillTxTable() {
  txTable = $('#recentTxTable').DataTable({
    ajax: '/api/datatableTx',
    searching: false,
    ordering: false,
    paging: false,
    columns: [
      {
        title: 'Tx Hash',
        data: 'hash',
        render: function (data) { return getTxLink(data, 20); },
      }, {
        title: 'From',
        data: 'from',
        render: function (data) { return getAddressLink(data, 20); },
      }, {
        // arrow
        data: null,
        className: '',
        defaultContent: '<i class="fa fa-lg fa-long-arrow-right"></i>',
      }, {
        title: 'To',
        data: 'to',
        render: function (data) { return getAddressLink(data, 20); },
      }, {
        title: 'Amount (ETH)',
        data: 'value',
      },
      // { data: null }, // @TODO: tx fee
      {
        title: 'Time',
        data: 'blockTimestamp',
        render: function (data) {
          return (new Date(data * 1000)).toLocaleString();
        },
      }, {
        title: 'Block',
        data: 'blockNumber',
        render: function (data, type, row) {
          var numString = $.fn.dataTable.render.number(',', '.').display(data, type, row);
          return '<a href="javascript:void(0)" onclick="blockClicked(' + data + ')">' + numString + '</a>';
        },
      },
    ],
  });
}

$(document).ready(fillBlocksTable);
$(document).ready(fillTxTable);
