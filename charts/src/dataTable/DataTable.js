import BootstrapTable from 'react-bootstrap-table-next';

import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import paginationFactory from 'react-bootstrap-table2-paginator';
import { getDataForDataTable } from '../dataHelper';

const columns = [{
    dataField: 'operatorId',
    text: 'Operator ID',
    sort: true
}, {
    dataField: 'name',
    text: 'Operation',
    sort: true
}, {
    dataField: 'count',
    text: 'Count',
    sort: true
}];

const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
}];
const DataTable = ({ notSelectedLabels, makeData }) => {
   
    return (
        <div>
            <BootstrapTable
                pagination={paginationFactory({ sizePerPage: 5, sizePerPageList: [5] })}
                keyField="id"
                data={getDataForDataTable(notSelectedLabels, makeData)}
                columns={columns}
                defaultSorted={defaultSorted}

            />
        </div>
    )
}
export default DataTable;