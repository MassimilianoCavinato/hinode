import React from 'react'

class DeviceTemplateRow extends React.Component{

    render(){

        return(
            <tr className='node-template-row'>
                <td className='col-xs-2'>
                    {this.props.template.type}
                </td>
                <td className='col-xs-2'>
                    {this.props.template.vendor}
                </td>
                <td className='col-xs-4'>
                    {this.props.template.model}
                </td>
                <td className='col-xs-2'>
                    <img src={this.props.template.image} style={{height: '40px'}} alt={this.props.template.image}/>
                </td>
                <td className='col-xs-1'>
                    <button onClick={() => this.props.switchToEditDeviceMode(this.props.template)} className='btn btn-sm btn-default'><span className='glyphicon glyphicon-pencil'> Edit</span></button>
                </td>
                <td className='col-xs-1'>
                    <button onClick={() => this.props.deleteTemplate(this.props.template._id)} className='btn btn-sm btn-danger' ><span className='glyphicon glyphicon-remove'> Delete</span></button>
                </td>
            </tr>
        )
    }
}
export default DeviceTemplateRow
