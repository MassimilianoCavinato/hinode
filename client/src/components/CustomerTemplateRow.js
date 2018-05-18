import React from 'react'
import { textifyPriority } from '../utils/utils.js'

class CustomerTemplateRow extends React.Component{

    render(){
        return(
            <tr className='node-template-row'>
                <td className='col-xs-3'>
                    {this.props.template.template_name}
                </td>
                <td className='col-xs-3'>
                    {this.props.template.provider}
                </td>
                <td className='col-xs-2'>
                    {textifyPriority(this.props.template.priority)}
                </td>
                <td className='col-xs-2'>
                    <img src={this.props.template.image} style={{height: '35px'}} alt={this.props.template.image} />
                </td>
                <td className='col-xs-1'>
                    <button onClick={() => this.props.switchToEditCustomerMode(this.props.template)} className='btn btn-sm btn-default'><span className='glyphicon glyphicon-pencil'> Edit</span></button>
                </td>
                <td className='col-xs-1'>
                    <button onClick={() => this.props.deleteTemplate(this.props.template._id)} className='btn btn-sm btn-danger' ><span className='glyphicon glyphicon-remove'> Delete</span></button>
                </td>
            </tr>
        )
    }
}

export default CustomerTemplateRow
