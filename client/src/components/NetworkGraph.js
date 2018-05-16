import React from 'react'
import { Helmet } from 'react-helmet'
import Graph from 'react-graph-vis'
import NodeModal from './NodeModal'
import CustomerNodeModal from './CustomerNodeModal'
import EdgeModal from './EdgeModal'
import axios from 'axios'
import  uuidv1 from 'uuid/v1'
import { SERVER_URL } from '../config/config'
import '../css/networkgraph.css'

class NetworkGraph extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            nodes: [],
            edges: [],
            mode: 'edit',
            networkButtons: {
                addNode: false,
                editNode: false,
                deleteElements: false,
                addEdge: false
            },
            actionHint: false,
            modal : false,
            node: {},
            edge: {},
            e: {
                pointer: {
                    canvas: {
                        x:  3139.0571737074524,
                        y: 2191.9180225526757
                    }
                }
            },
            addingEdge: false,
            marker: null,
            search_text: '',
            search_results: []
        }

        this.startPosition = { position: { x: 3139.0571737074524, y: 2191.9180225526757 }, scale: 0.025 }

        this.options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            edges:{ arrows: {to: {enabled: false }}, smooth: { enabled: true, type: 'cubicBezier', roundness: 0.75 }, width: 5},
            nodes: { shape: 'circularImage', shadow: { enabled: true }, scaling: {min: 10, max: 1000, label: {enabled: true, min: 30, max: 80, maxVisible: 100, drawThreshold: 1}}, size: 100, font: {size: 30}, color:{ highlight: {border: 'lime'}}},
            physics: false,
            interaction:{
                dragNodes: false
            }
        }
    }

    componentWillMount(){
        this.refreshNetwork()
    }

    networkOnInit(network){

        this.network = network
        this.network.moveTo(this.startPosition)
        this.network.manipulation.options.addEdge =  this.addEdge.bind(this)

        this.network.on('click', (e) => {
            this.controlClick(e)
            this.toggleNetworkButtons(e)

        })

        this.network.on('dragEnd', (e) => {
            this.controlDragEnd(e)
        })

        window.addEventListener("resize", () => {
            this.network.redraw()
        })

    }

    controlClick(e){
        this.setState({
            e: e,
            actionHint: false,
            search_text: '',
            search_results: []
        })
        this.network.disableEditMode()
        this.network.moveTo({
            position: { x: e.pointer.canvas.x, y: e.pointer.canvas.y},
            animation: true
        })
    }

    controlDragEnd(e){
        if(this.state.mode === 'move' && e.nodes.length === 1){
            let node = {
                id: e.nodes[0],
                x: e.pointer.canvas.x,
                y: e.pointer.canvas.y
            }
            axios.put(SERVER_URL+'/api/networkgraph/movenode', node)
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    toggleMode(){
        let options = this.options
        if(this.state.mode === 'edit'){
            this.setState({mode: 'move', actionHint: 'Feel free to move devices around!'})
            options.interaction.dragNodes = true
        }
        else{
            this.setState({mode: 'edit', actionHint: false})
            options.interaction.dragNodes = false
        }
        console.log(options)
        this.network.setOptions(options)
    }

    addEdge(edge, callback){

        if(edge.from !== edge.to){
            this.setState({
                modal: 'edge',
                actionHint: 'Complete the form and save to add a new link on the graph.',
                edge: {
                    id: uuidv1(),
                    from: edge.from,
                    to: edge.to
                },
                addingEdge: true
            })
        }
        else{
            this.setState({
                modal: false,
                actionHint: false,
                edge: {},
                addingEdge: false
            })
        }
        callback(null)

    }

    refreshNetwork(){

        axios.all([
            axios.get(SERVER_URL+'/api/networkgraph/getnodes'),
            axios.get(SERVER_URL+'/api/networkgraph/getedges')
        ])
        .then(axios.spread((nodeData, edgeData) => {
            this.setState({
                nodes: nodeData.data.data,
                edges: edgeData.data.data,
            })
            let currentScale = this.network.getScale()
            this.network.setData({nodes: nodeData.data.data, edges: edgeData.data.data})
            this.network.moveTo({position: { x: this.state.e.pointer.canvas.x, y: this.state.e.pointer.canvas.y}, scale: currentScale})
        }))
    }

    toggleNetworkButtons(e){

        this.setState({
            networkButtons:{
                addNode: e.nodes.length === 0 && e.edges.length === 0,
                editNode: e.nodes.length > 0,
                deleteElements: e.nodes.length > 0 || e.edges.length > 0,
                addEdge: e.edges.length === 0 || e.nodes.length > 0
            }
        })
    }

    setModal(type){

        this.setState({
            networkButtons: {
                addNode: false,
                editNode: false,
                deleteElements: false,
                addEdge: false
            },
            modal: type
        })
    }

    toggleNetworkModals(){

        switch(this.state.modal){
            case 'node device':
                return <NodeModal closeModal={this.closeModal.bind(this)} node={this.state.node} refreshNetwork={this.refreshNetwork.bind(this)} />
            case 'node customer':
                return <CustomerNodeModal closeModal={this.closeModal.bind(this)} node={this.state.node} refreshNetwork={this.refreshNetwork.bind(this)} />
            case 'edge':
                return <EdgeModal  closeModal={this.closeModal.bind(this)} edge={this.state.edge} refreshNetwork={this.refreshNetwork.bind(this)} />
            default:
                return null
        }

    }

    enterAddEdgeMode(){
        this.network.unselectAll()
        this.setState({
            actionHint: "Connect 2 nodes by drawing a line between them",
            networkButtons: {},
            addingEdge: true
        })
        this.network.addEdgeMode()
    }

    enterAddNodeMode(nodeType){

        let randomId =  uuidv1()

        this.setState({
            modal: nodeType,
            node: {
                id: randomId,
                x: this.state.e.pointer.canvas.x,
                y: this.state.e.pointer.canvas.y,
                tags: []
            },
            actionHint: 'Complete the form and save to add a new node.',
            networkButtons: {
                addNode: false,
                editNode: false,
                deleteElements: false,
                addEdge: false
            },
            addingEdge: false
        })
    }

    enterEditNodeMode(){

        axios.get(SERVER_URL+'/api/networkgraph/getnode', {params:{id:this.network.getSelectedNodes()[0]}})
        .then((response) => {
            if(response.data.ok){
                let category = response.data.node.category.toLowerCase()
                console.log(response.data.node)
                this.setState({
                    modal: 'node ' + category,
                    node: response.data.node,
                    actionHint: 'Modify and save this selected node',
                    networkButtons: {
                        addNode: false,
                        editNode: false,
                        deleteElements: false,
                        addEdge: false
                    }
                })
            }
            else{
                console.log("There was an issue with the backend")
            }
        })
        .catch((error) => {
            console.log(error)
        })

    }

    enterDeleteSelectedMode(){

        let selection = this.network.getSelection()

        if(window.confirm('Do you really want to delete the selected elements?')){
            axios.delete(SERVER_URL+'/api/networkgraph/deleteelements', {params: selection})
            .then((response) => {

                this.setState({
                    networkButtons: {},
                    actionHint: selection.nodes.length.toString()+' nodes  and '+ selection.edges.length.toString()+' edges deleted'
                })
            	this.refreshNetwork()
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    networkButtons: {},
                    actionHint: "Something didn't work."
                })
            })
        }
    }

    closeModal(){

        this.setState({
            modal: false,
            node: {},
            edge: {},
            networkButtons: {},
            actionHint: false,
            addingEdge: false
        })
        this.network.disableEditMode()
    }

    filterResults(e){

        let search_text = e.target.value.toLowerCase()
        this.setState({search_text: search_text})
        let search_results = []
        if(search_text.length > 0){
            let max_size = 15
            search_results = this.state.nodes.filter(node => {
                if(node.category === "Device"){
                    return node.type.toLowerCase().includes(search_text) ||
                        node.vendor.toLowerCase().includes(search_text) ||
                        node.model.toLowerCase().includes(search_text) ||
                        node.name.toLowerCase().includes(search_text) ||
                        node.ip.toLowerCase().includes(search_text)
                }
                else if(node.category === "Customer"){
                    return node.name.toLowerCase().includes(search_text) ||
                        node.provider.toLowerCase().includes(search_text)
                }
            })
            if(search_results.length > max_size ){
                search_results = search_results.slice(0, max_size)
            }
        }
        this.setState({
            search_results: search_results
        })
    }

    showSearchResults(){
        return this.state.search_results.map((node) => {
            if(node.category === "Device"){
                return(
                    <div key={node.id} className="nodeSearchResult form-control" onClick={() => {this.focusSearch(node)}}>
                        {node.vendor} {node.model}
                        <br />
                        {node.name}
                        <br />
                        {node.ip}
                        <img src={node.image} alt=''/>
                    </div>
                )
            }
            else if(node.category === "Customer"){
                return(
                    <div key={node.id} className="nodeSearchResult form-control" onClick={() => {this.focusSearch(node)}}>
                        {node.name}
                        <br />
                        {node.ips.map((ip) => {return <div>{ip.ip}</div>})}
                        <img src={node.image} alt=''/>
                    </div>
                )
            }
        })
    }

    focusSearch(node){

        this.network.moveTo({
            position:{x: node.x, y: node.y},
            scale: 0.75,
            animation: {
                duration: 500,
                easingFunction: 'easeInOutCubic'
            }
        })

        this.network.unselectAll()
        this.network.selectNodes([node.id])
        this.setState({
            search_text: '',
            search_results: [],
            networkButtons: {
                editNode: true,
                addEdge: true,
                deleteElements: true,
            }
        })
    }

    render(){

        return(
            <div style={{height: '95vh'}}>
                <Helmet>
                    <title>Network Graph</title>
                    <style>{'body{background-image: url(https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/1273220/300/200/m1/fpnw/wm0/gray-isometric-grid-with-vertical-guideline-on-white-seamless-pattern-.jpg?1463317665&s=9bc760d2e059329da23b2e642ab50602);}'}</style>
                </Helmet>

                <div style={{backgroundColor: '#2e86c1', padding: '4px', height: '45px', width: '100%', position: 'relative'}}>
                    <input type="text" className="form-control"  placeholder="Find..." value={this.state.search_text} onChange={(e)=>{this.filterResults(e)}} style={{position: 'absolute', right: 50, maxWidth: '250px'}}/>
                </div>

                <Graph  options={this.options}  graph={{nodes: this.state.nodes, edges: this.state.edges}} getNetwork={this.networkOnInit.bind(this)} />

                { this.state.actionHint ? <div id='action-hint' className='alert-success'>{this.state.actionHint}</div> : null }

                <div id="searchResultContainer">
                    { this.state.search_results.length > 0 ? this.showSearchResults() : null }
                </div>

                {this.toggleNetworkModals()}

                <div className='NetworkButtonsContainer' style={{textAlign: 'right'}}>
                    {this.state.mode === 'edit' ? <button  className='networkGraphButton' onClick={()=>this.toggleMode()} style={{backgroundImage: 'url(https://cdn4.iconfinder.com/data/icons/vectory-multimedia-1/40/move_4-512.png)', backgroundColor: ' #ffffff'}} title='Enable move mode' /> : <button  className='networkGraphButton' onClick={()=>this.toggleMode()} style={{backgroundImage: 'url(https://d30y9cdsu7xlg0.cloudfront.net/png/1320-200.png)', backgroundColor: ' #ffffff'}} title='Enable edit mode' />}
                    { this.state.networkButtons.addNode && this.state.mode === 'edit' ? <button id='add-node' className='networkGraphButton' onClick={() => this.enterAddNodeMode("node device")} style={{backgroundImage: 'url(https://d30y9cdsu7xlg0.cloudfront.net/png/157524-200.png)', backgroundColor: '#d5f5e3'}} title='Add Device Node' />  : null }
                    { this.state.networkButtons.addNode && this.state.mode === 'edit' ? <button id='add-node' className='networkGraphButton' onClick={() => this.enterAddNodeMode("node customer")} style={{backgroundImage: 'url(https://www.freeiconspng.com/uploads/account-profile-user-icon--icon-search-engine-10.png)', backgroundColor: '#d5f5e3'}} title='Add Customer Node' />  : null }
                    { this.state.networkButtons.editNode && this.state.mode === 'edit' ? <button id='edit-node' className='networkGraphButton'  onClick={() => this.enterEditNodeMode()} style={{backgroundImage: 'url(https://png.icons8.com/metro/1600/edit.png)', backgroundColor: ' #fcf3cf'}} title='Edit Node' /> : null }
                    { this.state.networkButtons.addEdge && this.state.mode === 'edit' ? <button id='add-edge' className='networkGraphButton'  onClick={() => this.enterAddEdgeMode()} style={{backgroundImage: 'url(http://simpleicon.com/wp-content/uploads/vector-path-curve.png)', backgroundColor: '#d5f5e3'}} title='Add Edge' /> : null }
                    { this.state.networkButtons.deleteElements && this.state.mode === 'edit' ? <button id='delete-selected' className='networkGraphButton' onClick={() => this.enterDeleteSelectedMode()} style={{backgroundImage: 'url(https://cdn.iconscout.com/public/images/icon/premium/png-512/trash-bin-recycle-dustbin-environment-302f53bae36f44ba-512x512.png)', backgroundColor: '#ec7063'}} title='Delete Selected' /> : null }
                </div>
            </div>
        )
    }
}


export default NetworkGraph
