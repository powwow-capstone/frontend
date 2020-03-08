import React from 'react';
import { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Loader from '../Loader/Loader'

import '../../css/LoadFiltersPopup.css'

const columns = [
    {
        id: 'date',
        label: 'Date Range',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'crop',
        label: 'Crop',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'min_acreage',
        label: 'Min Acreage',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'max_acreage',
        label: 'Max Acreage',
        minWidth: 170,
        align: 'left',
    },
    {
        id: 'load',
        label: 'Load',
        minWidth: 50,
    },
    {
        id: 'delete',
        label: 'Delete',
        minWidth: 50,
    },
];

class LoadFiltersPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveList : [],
            loading : true,
            page : 0,
            rowsPerPage : 5,
        };
        this.calculateDateRange = this.calculateDateRange.bind(this);
        this.createFiltersTableRows = this.createFiltersTableRows.bind(this);
        this.handleLoadFilter = this.handleLoadFilter.bind(this);
    }

    componentDidMount() {
        this.getSavedFilters();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.authUser !== this.props.authUser) {
            this.setState({loading : true});
            this.getSavedFilters();
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({page : newPage});
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: +event.target.value})
    };

    handleLoadFilter(savedFilter) {
        this.props.closePopup();
        this.props.loadFilters(savedFilter);
    }

    handleDeleteFilter(savedFilter) {
        console.log("Delete");
        console.log(savedFilter);
    }

    getSavedFilters() {
        this.props.firebase
            .searches()
            .orderByChild('userId')
            .equalTo(this.props.authUser.uid)
            .on('value', snapshot => {
                const searchObject = snapshot.val();
                if (searchObject) {
                    const searchList = Object.keys(searchObject).map(key => ({
                        ...searchObject[key],
                        uid: key,
                    }));
                    this.setState({saveList : searchList, loading : false });
                }
            }
        );

    }

    createFiltersTableRows() {
        console.log("Create filter table rows");
        var filter_cells = [];

        this.state.saveList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => {
            filter_cells.push (
                <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell component="th" scope="row">
                        {this.calculateDateRange(row.start_month, row.start_year, row.end_month, row.end_month)}
                    </TableCell>
                    <TableCell align="left">{row.crop_type}</TableCell>
                    <TableCell align="left">{row.acreage_min}</TableCell>
                    <TableCell align="left">{row.acreage_max}</TableCell>
                    <TableCell align="left"><button onClick={() => this.handleLoadFilter(row)}>Load</button></TableCell>
                    <TableCell align="left"><button onClick={() => this.handleDeleteFilter(row)}>Delete</button></TableCell>
                </TableRow>
            );
        })

        return filter_cells
    }

    calculateDateRange(start_month, start_year, end_month, end_year) {

        return "";
    }

    render() {

        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <div className = "row">
                        <h1>Saved Filter Options</h1>
                        <button onClick={this.props.closePopup}>Close</button>
                    </div>
                    <Paper className="loadfilters_paper">
                        <TableContainer className="loadfilters_table">
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                       {columns.map(column => (
                                            <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                            >
                                            {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.createFiltersTableRows()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5]}
                            component="div"
                            count={this.state.saveList.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
                <Loader loading={this.state.loading} />
            </div>
        );
    }
}

export default LoadFiltersPopup;