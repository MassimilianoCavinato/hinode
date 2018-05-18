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
            moveMode: false,
            networkButtons: {
                addNode: false,
                editNode: false,
                checkNeighbours: false,
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
            search_results: [],
            search_cursor: 0
        }

        this.startPosition = { position: { x: 3139.0571737074524, y: 2191.9180225526757 }, scale: 0.025 }

        this.options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            edges:{
                arrows: {
                    to: {
                        enabled: false
                    }
                },
                smooth: false,
                // smooth: {
                //     enabled: true,
                //     type: 'cubicBezier',
                //     roundness: 0.75
                // },
                width: 5
            },
            nodes: {
                shape: 'circularImage',
                shadow: {
                    enabled: true
                },
                scaling: {
                    min: 10,
                    max: 1000,
                    label: {
                        enabled: true,
                        min: 30,
                        max: 80,
                        maxVisible: 100,
                        drawThreshold: 1
                    }
                },
                size: 100,
                font: {
                    size: 30
                },
                color: {
                    highlight: {
                        border: 'lime'
                    }
                }
            },
            physics: false,
            interaction:{
                dragNodes: false,
                keyboard:{
                    enabled: true,
                    speed:{
                        x: 5,
                        y: 5
                    }
                }
            }
        }
    }

    componentWillMount(){
        this.refreshNetwork()
    }

    networkOnInit(network){

        this.network = network

        this.network.manipulation.options.addEdge =  this.addEdge.bind(this)

        this.network.on('click', (e) => {
            this.resetNetworkButtons()
            this.controlClick(e)
        })

        this.network.on('doubleClick', (e) => {
            this.resetNetworkButtons()
            this.controlDoubleClick(e)
        })

        this.network.on('dragEnd', (e) => {
            this.controlDragEnd(e)
        })

        this.network.on('dragStart', (e) => {
            this.resetNetworkButtons()
        })

        this.network.on('zoom', (e) => {
            this.resetNetworkButtons()
        })

        window.addEventListener("resize", () => {
            this.network.redraw()
        })

    }

    resetNetworkButtons(){

        this.setState({
            networkButtons: {
                addNode: false,
                editNode: false,
                deleteElements: false,
                addEdge: false
            }
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
        let selection = this.network.getSelection()

        if(selection.nodes.length === 0 && selection.edges.length === 0){
            this.network.moveTo({
                position: {
                    x: e.pointer.canvas.x,
                    y: e.pointer.canvas.y
                },
                animation: {
                    duration: 500,
                    easingFunction: 'easeOutCubic'
                }
            })

            setTimeout(() => {
                this.setState({
                    networkButtons: {
                        addNode: true,
                        editNode: false,
                        deleteElements: false,
                        addEdge: false
                    }
                })
            }, 550)
        }
    }

    controlDoubleClick(e){

        this.setState({
            e: e,
            actionHint: false,
            search_text: '',
            search_results: []
        })
        this.network.disableEditMode()
        let selection = this.network.getSelection()
        if(selection.nodes.length === 1){
            this.network.focus(selection.nodes[0], {
                scale: 0.75,
                animation: {
                    duration: 500,
                    easingFunction: 'easeOutCubic'
                }
            })
        }
        else if(selection.edges.length === 1){

            this.network.moveTo({
                position: {
                    x: e.pointer.canvas.x,
                    y: e.pointer.canvas.y
                },
                scale: 0.75,
                animation: {
                    duration: 500,
                    easingFunction: 'easeOutCubic'
                }
            })
        }
        setTimeout(() => {
            this.toggleNetworkButtons(e)
        }, 520)
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

    lockUnlockController() {

        //see toggleMoveMode()
        if(this.state.moveMode) {
            return(
                <button
                    onClick={()=>this.toggleMoveMode()}
                    className='networkGraphButton lockUnlock'
                    style={{backgroundImage: 'url('+SERVER_URL+'/icon/unlocked.png)', backgroundColor: ' #ffffff'}}
                    title='Enable edit mode'
                />
            )
        }
        else{
            return (
                <button
                    onClick={()=>this.toggleMoveMode()}
                    className='networkGraphButton lockUnlock'
                    style={{backgroundImage: 'url('+SERVER_URL+'/icon/locked.png)', backgroundColor: ' #ffffff'}}
                    title='Enable move mode'
                />
            )
        }
    }

    toggleMoveMode(){

        this.resetNetworkButtons()
        let options = this.options

        if(this.state.moveMode){
            this.setState({moveMode: false, actionHint: false})
            options.interaction.dragNodes = false
        }
        else{
            this.setState({moveMode: true, actionHint: 'Feel free to move devices around!'})
            options.interaction.dragNodes = true
        }

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
                editNode: e.nodes.length === 1,
                addEdge: e.nodes.length === 1,
                checkNeighbours: e.nodes.length === 1,
                deleteElements: e.nodes.length > 0 || e.edges.length > 0,

            }
        }, console.log(this.state.networkButtons))
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
            let max_size = 10
            search_results = this.state.nodes.filter(node =>
                (node.category === "Device" && (
                    node.type.toLowerCase().includes(search_text) ||
                    node.vendor.toLowerCase().includes(search_text) ||
                    node.model.toLowerCase().includes(search_text) ||
                    node.name.toLowerCase().includes(search_text) ||
                    node.ip.toLowerCase().includes(search_text)
                ))
                ||
                (node.category === "Customer" && (
                    node.name.toLowerCase().includes(search_text) ||
                    node.provider.toLowerCase().includes(search_text)
                ))
            )

            if(search_results.length > max_size ){
                search_results = search_results.slice(0, max_size)
            }
        }
        this.setState({
            search_results: search_results,
            search_cursor: 0
        })
    }

    showSearchResults(){

        return this.state.search_results.map((node, index) => {
            if(node.category === "Device"){
                return(
                    <div
                        key={node.id}
                        className={`nodeSearchResult form-control ${this.state.search_cursor === index ? 'withCursor' : null}`}
                        onClick={() => {this.focusSearch(node)}}
                    >
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
                    <div
                        key={node.id}
                        className={"nodeSearchResult form-control "+this.state.search_cursor === index ? 'withCursor' : null}
                        onClick={() => {this.focusSearch(node)}}
                    >
                        {node.name}
                        <br />
                        {node.ips.map((ip) => {return <div>{ip.ip}</div>})}
                        <img src={node.image} alt=''/>
                    </div>
                )
            }
        })
    }

    moveCursorOnResults(e){

        let { search_results, search_cursor } = this.state
        let newCursorPosition
        if(this.state.search_results.length > 0){
            if(e.keyCode === 38 && search_cursor > 0){ //up
                newCursorPosition = this.state.search_cursor - 1
                this.setState( prevState => ({
                    search_cursor: prevState.search_cursor - 1
                }))
                console.log(newCursorPosition)
            }
            else if(e.keyCode === 40 && search_cursor < search_results.length -1){ //down
                newCursorPosition = this.state.search_cursor + 1
                this.setState( prevState => ({
                    search_cursor: prevState.search_cursor + 1
                }))
                console.log(newCursorPosition)
            }
            else if(e.keyCode === 13){ //down
                this.focusSearch(this.state.search_results[this.state.search_cursor])
            }

        }
    }

    focusSearch(node){

        this.network.moveTo({
            position:{x: node.x, y: node.y},
            scale: 0.75,
            animation: {
                duration: 250,
                easingFunction: 'easeInOutCubic'
            }
        })
        this.network.unselectAll()
        this.network.selectNodes([node.id])
        this.setState({
            search_text: '',
            search_results: [],
            search_cursor: 0
        })

        this.toggleNetworkButtons({nodes: [node.id]})
    }

    showNetworkGraphHeader(){
        return(
            <div id='network-graph-header'>
                {this.lockUnlockController()}
                <input
                    id='find-networkgraph'
                    type="text"
                    className="form-control pull-right"
                    placeholder="Find..."
                    value={this.state.search_text}
                    onChange={(e)=>{this.filterResults(e)}}
                    onKeyDown={(e)=>{this.moveCursorOnResults(e)}}
                />
            </div>
        )
    }

    showActionHint(){
        return(
            this.state.actionHint ? <div id='action-hint' className='alert-success'>{this.state.actionHint}</div> : null
        )
    }

    searchResults(){
        return(
            <div id="searchResultContainer">
                { this.state.search_results.length > 0 ? this.showSearchResults() : null }
            </div>
        )
    }

    showNetworkController(){
        return(
            <div id='network-controller-container'>
                    <div>
                        { this.state.networkButtons.editNode && !this.state.moveMode ? <button id='edit-node' className='network-controller-button'  onClick={() => this.enterEditNodeMode()} style={{backgroundImage: 'url('+SERVER_URL+'/icon/edit.png)'}} title='Edit Node' /> : null }
                    </div>
                    <div>
                        { this.state.networkButtons.addEdge && !this.state.moveMode ? <button id='add-edge' className='network-controller-button'  onClick={() => this.enterAddEdgeMode()} style={{backgroundImage: 'url('+SERVER_URL+'/icon/edge.png)'}} title='Add Edge' /> : null }
                    </div>
                    <div>
                        { this.state.networkButtons.checkNeighbours && !this.state.moveMode ? <button id='check-neighbours' className='network-controller-button'  onClick={() => alert('checking neighbours')} style={{backgroundImage: 'url('+SERVER_URL+'/icon/network_neighbours_icon.png)'}} title='Check Neighbours' /> : null }
                    </div>
                    <div>
                        { this.state.networkButtons.deleteElements && !this.state.moveMode ? <button id='delete-selected' className='network-controller-button' onClick={() => this.enterDeleteSelectedMode()} style={{backgroundImage: 'url('+SERVER_URL+'/icon/trash_bin.png)'}} title='Delete Selected' /> : null }
                    </div>
                    <div>
                        { this.state.networkButtons.addNode && !this.state.moveMode ? <button id='add-device-node' className='network-controller-button' onClick={() => this.enterAddNodeMode("node device")} style={{backgroundImage: 'url('+SERVER_URL+'/icon/new_node_icon.png)'}} title='Add Device Node' /> : null }
                    </div>
                    <div>
                        { this.state.networkButtons.addNode && !this.state.moveMode ? <button id='add-customer-node' className='network-controller-button' onClick={() => this.enterAddNodeMode("node customer")} style={{backgroundImage:'url('+SERVER_URL+'/icon/customer_premises.png)'}} title='Add Customer Node' /> : null }
                    </div>
            </div>
        )
    }

    render(){

        return(
            <div style={{height: '95vh'}}>
                <Helmet>
                    <title>Network Graph</title>
                    <style>{'body{background-image: url('+SERVER_URL+'/icon/hex_grid.jpg);}'}</style>
                </Helmet>
                {this.showNetworkGraphHeader()}
                <Graph  options={this.options}  graph={{nodes: this.state.nodes, edges: this.state.edges}} getNetwork={this.networkOnInit.bind(this)} />
                {this.showActionHint()}
                {this.searchResults()}
                {this.showNetworkController()}
                {this.toggleNetworkModals()}
            </div>
        )
    }
}


export default NetworkGraph
