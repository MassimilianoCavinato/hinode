import React from 'react'
import Graph from 'react-graph-vis'

class NeighbourNetworkGraph extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            root: this.props.root,
            nodes: this.props.nodes,
            edges: this.props.edges,
            options: {
                autoResize: true,
                height: '396px',
                width: '100%',
                edges:{
                    arrows: {
                        to: {
                            enabled: false
                        }
                    },
                    smooth: true,
                    width: 5
                },
                nodes: {
                    shape: 'circularImage',
                    shadow: {
                        enabled: false
                    },
                    color: {
                        highlight: {
                            border: 'lime'
                        }
                    }
                },
                physics: true,
                interaction:{
                    dragNodes: false,
                }
            }
        }
    }

    componentDidMount(){

    }
    networkOnInit(network){
        this.network = network
    }

    showGraph(){
        return(
            <div id='sub-graph-wrapper'>
                <Graph
                    options={this.state.options}
                    graph={{nodes: this.state.nodes, edges: this.state.edges}}
                    getNetwork={this.networkOnInit.bind(this)}
                />
                <button onClick={this.props.closeNeighbourNetwork} style={{position: 'absolute', top: '8px', right: '8px'}}>Close</button>
            </div>
        )
    }

    render(){

        return(
            <div style={{height: '400px', width: '60vw', border: '2px outset #999', backgroundColor: '#FEFEFE', borderRadius: '4px'}}>
                {this.showGraph()}
            </div>
        )
    }
}


export default NeighbourNetworkGraph
