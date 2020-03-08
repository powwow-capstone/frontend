import React from 'react';
import { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CloseIcon from '@material-ui/icons/Close';
import Loader from '../Loader/Loader'

import '../../css/LoadFiltersPopup.css'
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

const columns = [
    {
        id: 'date',
        label: 'Date Range',
        minWidth: 200,
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
        minWidth: 75,
        align: 'left',
    },
    {
        id: 'max_acreage',
        label: 'Max Acreage',
        minWidth: 75,
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

    handleDeleteFilter(savedFilter, index) {
        var array = [...this.state.saveList];
        // var index = array.indexOf(savedFilter)
        array.splice(index, 1);
        // If index is the last element on a page, then this page should no longer be visible
        // unless page == 0
        var page = this.state.page;
        if (this.state.page > 0) {
            if (index === (this.state.page * this.state.rowsPerPage)) {
                page -= 1;
            }   
        }


        this.setState({saveList : array, page : page});

        // Delete from firebase
        this.props.firebase
            .search(savedFilter.uid)
            .remove();
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
                else {
                    this.setState({loading : false});
                }
            }
        );

    }

    createFiltersTableRows() {
        var filter_cells = [];

        this.state.saveList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, page_index) => {
            const index = (this.state.page * this.state.rowsPerPage) + page_index;
            var crop_type = row.crop_type;
            if (crop_type === "null") {
                crop_type = "";
            }
            var acreage_min = row.acreage_min;
            if (acreage_min === "null") {
                acreage_min = "";
            }
            var acreage_max = row.acreage_max;
            if (acreage_max === "null") {
                acreage_max = "";
            }
            filter_cells.push (
                <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell component="th" scope="row">
                        {this.calculateDateRange(row.start_month, row.start_year, row.end_month, row.end_year)}
                    </TableCell>
                    <TableCell align="left">{crop_type}</TableCell>
                    <TableCell align="left">{acreage_min}</TableCell>
                    <TableCell align="left">{acreage_max}</TableCell>
                    <TableCell align="left"><Button variant="outlined" color="primary" onClick={() => this.handleLoadFilter(row)}>Load</Button></TableCell>
                    <TableCell align="left"><Button variant="outlined" color="secondary" onClick={() => this.handleDeleteFilter(row, index)}>Delete</Button></TableCell>
                </TableRow>
            );
        });

        return filter_cells;
    }

    calculateDateRange(start_month, start_year, end_month, end_year) {
        var range = ""
        if (start_month !== "null") {
            // For the date range, either both start_month and end_month must be "null" or neither are
            range += months[parseInt(start_month, 10) - 1] + "-"; 
            range += start_year + " to ";
            range += months[parseInt(end_month, 10) - 1] + "-";
            range += end_year;
        }
        else {
            range = start_year;
        }
        return range;
    }

    render() {

        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <div className = "row popup_header">
                        <h4 className="popup_headertext">Saved Filter Options</h4>
                        <CloseIcon className="popup_close" onClick={this.props.closePopup}></CloseIcon>
                    </div>
                    {!this.state.loading && <Paper className="loadfilters_paper">
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
                    </Paper>}
                </div>
                <Loader loading={this.state.loading} />
            </div>
        );
    }
}

export default LoadFiltersPopup;