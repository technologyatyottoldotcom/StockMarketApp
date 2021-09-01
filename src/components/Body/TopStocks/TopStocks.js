import React from 'react';
import $ from 'jquery';
import Axios from 'axios';
import UpperStock from './UpperStock';
import IndexSelectPopup from '../AppPopups/IndexSelectPopup/IndexSelectPopup';
import MoreDots from '../../../assets/icons/moredots.svg';

const PAN = 'ALQPD7054E';
const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;


class TopStocks extends React.PureComponent {

	constructor(props)
	{
		super(props);
		this.state = {

			resetactive : false,
			indexflag : false,
			indexopen : false,
			totalselectedindex : 0,
			StatusConfig : {
				
			},
			IndicesList : [
				{ name : 'BSE SENSEX' , code : 1 , exchange : 'BSE', exchangecode : 6, index : 'SENSEX', order : 0 },
				{ name : 'BSE MIDCAP' , code : 30 , exchange : 'BSE', exchangecode : 6, index : 'BSE-MIDCAP', order : 0 },
				{ name : 'BSE SMLCAP' , code : 31 , exchange : 'BSE', exchangecode : 6, index : 'BSE-SMLCAP', order : 0 },
				{ name : 'NIFTY 50' , code : 26000 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_50', order : 0 },
				{ name : 'INDIA VIX' , code : 26017 , exchange : 'NSE', exchangecode : 1, index : 'INDIA_VIX', order : 0 },
				{ name : 'NIFTY 100' , code : 26012 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_100', order : 0 },
				{ name : 'NIFTY 200' , code : 26033 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_200', order : 0 },
				{ name : 'NIFTY 500' , code : 26004 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_500', order : 0 },
				{ name : 'NIFTY AUTO' , code : 26029 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_AUTO', order : 0 },
				{ name : 'NIFTY BANK' , code : 26009 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_BANK', order : 0 },
				{ name : 'NIFTY CPSE' , code : 26041 , exchange : 'NSE', index : 'NIFTY_CPSE', order : 0 },
				{ name : 'NIFTY COMMODITIES' , code : 26035 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_COMMODITIES', order : 0 },
				{ name : 'NIFTY CONSUMPTION' , code : 26036 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_CONSUMPTION', order : 0 },
				{ name : 'NIFTY DIV OPPS 50' , code : 26034 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_DIV_OPPS_50', order : 0 },
				{ name : 'NIFTY ENERGY' , code : 26020 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_ENERGY', order : 0 },
				{ name : 'NIFTY FMCG' , code : 26021 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_FMCG', order : 0 },
				{ name : 'NIFTY FIN SERVICE' , code : 26037 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_FIN_SERVICE', order : 0 },
				{ name : 'NIFTY GROWSECT 15' , code : 26001 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_GROWSECT_15', order : 0 },
				{ name : 'NIFTY IT' , code : 26008 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_IT', order : 0 },
				{ name : 'NIFTY MNC' , code : 26022 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_MNC', order : 0 },
				{ name : 'NIFTY MEDIA' , code : 26031 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_MEDIA', order : 0 },
				{ name : 'NIFTY METAL' , code : 26030 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_METAL', order : 0 },
				{ name : 'NIFTY MID LIQ 15' , code : 26046 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_MID_LIQ_15', order : 0 },
				{ name : 'NIFTY MIDCAP 50' , code : 26014 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_MIDCAP_50', order : 0 },
				{ name : 'NIFTY NEXT 50' , code : 26013 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_NEXT_50', order : 0 },
				{ name : 'NIFTY PSE' , code : 26024 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_PSE', order : 0 },
				{ name : 'NIFTY PSU BANK' , code : 26025 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_PSU_BANK', order : 0 },
				{ name : 'NIFTY PHARMA' , code : 26023 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_PHARMA', order : 0 },
				{ name : 'NIFTY PVT BANK' , code : 26047 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_PVT_BANK', order : 0 },
				{ name : 'NIFTY REALTY' , code : 26018 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_REALTY', order : 0 },
				{ name : 'NIFTY SERV SECTOR' , code : 26026 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY_SERV_SECTOR', order : 0 },
				{ name : 'NIFTY100 LIQ 15' , code : 26040 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY100_LIQ_15', order : 0 },
				{ name : 'NIFTY50 VALUE 20' , code : 26045 , exchange : 'NSE', exchangecode : 1, index : 'NIFTY50_VALUE_20', order : 0 }
			],
			SelectedIndicesList : [],
			InitialSelectedList : [],
			InitialUnselectedList : [],
		}

		this.getIndexWithOrder = this.getIndexWithOrder.bind(this);
		this.toggleIndexState = this.toggleIndexState.bind(this);
		this.swapIndexState = this.swapIndexState.bind(this);
		this.setIndicesList = this.setIndicesList.bind(this);
		this.saveIndexConfigs = this.saveIndexConfigs.bind(this);
		this.resetIndexConfigs = this.resetIndexConfigs.bind(this);
		this.reorderList = this.reorderList.bind(this);
		this.openIndexPopup = this.openIndexPopup.bind(this);
		this.closeIndexPopup = this.closeIndexPopup.bind(this);
	}

	componentDidMount()
	{
		this.getIndexWithOrder();
	}

	getIndexWithOrder()
	{
		const {IndicesList} = this.state;
		Axios.get(`${REQUEST_BASE_URL}/IndicesList/${PAN}`)
		.then((response)=>{
			const data = response.data;
			if(data.status === 'success')
			{
				const indexlist = data.data;
				indexlist.forEach((ind)=>{
					let ItemIndex = IndicesList.findIndex(ele => ele.index === ind.index);
					IndicesList[ItemIndex]['order'] = parseInt(ind.orderno);
				});

				let SelectedIndices = [];
				let UnselectedIndices = [];

				IndicesList.forEach((ele)=>{
					if(ele.order > 0)
					{
						SelectedIndices.push(ele);
					}
					else
					{
						UnselectedIndices.push(ele);
					}
				});

				SelectedIndices.sort((a,b)=>(a.order - b.order));

				this.setState({
					IndicesList,
					SelectedIndicesList : SelectedIndices,
					InitialUnselectedList : JSON.parse(JSON.stringify(UnselectedIndices)),
					InitialSelectedList : JSON.parse(JSON.stringify(SelectedIndices)),
					totalselectedindex : IndicesList.filter((ele) => ele.order >0 ).length
				});
				

			}
		})
	}

	toggleIndexState(index,value)
	{
		let {IndicesList,totalselectedindex} = this.state;
		// console.log(IndicesList,totalselectedindex);
		let ItemIndex = IndicesList.findIndex(ele => ele.index === index);
		// console.log(index,ItemIndex,value)
		if(value)
		{
			// console.log('ADD');
			IndicesList[ItemIndex]['order'] = totalselectedindex + 1;
			this.setIndicesList(IndicesList);
		}
		else
		{
			// console.log('REMOVE');
			IndicesList[ItemIndex]['order'] = parseInt(0);
			this.reorderList(IndicesList);
		}
	}
	
	swapIndexState(index,order,action)
	{
		let {IndicesList,totalselectedindex} = this.state;

		// console.log(IndicesList)

		// console.log(index,order,action);

		let neworder = action ? order - 1 : order + 1;

		// console.log(order,neworder);

		if(neworder <= totalselectedindex && neworder >= 1)
		{
			let currentIndx = IndicesList.findIndex((ele) => ele.order === order);
			let newIndx = IndicesList.findIndex((ele) => ele.order === neworder);

			// console.log(currentIndx,newIndx,IndicesList[currentIndx],IndicesList[newIndx]);

			if(currentIndx >= 0)
			{
				IndicesList[currentIndx]['order'] = neworder;
			}

			// console.log(currentIndx,newIndx,IndicesList[currentIndx],IndicesList[newIndx]);

			if(newIndx >= 0)
			{
				IndicesList[newIndx]['order'] = order;
			}

			// console.log(currentIndx,newIndx,IndicesList[currentIndx],IndicesList[newIndx]);


			this.setIndicesList(IndicesList);
		}


	}

	setIndicesList(IndicesList,reset=true)
	{
		IndicesList.sort((a,b) => (a.order - b.order));
		this.setState({
			IndicesList : IndicesList,
			totalselectedindex : IndicesList.filter((ele) => ele.order > 0 ).length,
			indexflag : !this.state.indexflag,
			resetactive : reset
		});
	}

	saveIndexConfigs()
	{
		let {IndicesList} = this.state;	

		let InitialSelectedList = [];
		let InitialUnselectedList = [];


		IndicesList.forEach((ele)=>{
			if(ele.order > 0)
			{
				InitialSelectedList.push(ele);
			}
			else
			{
				InitialUnselectedList.push(ele);
			}
		});

		InitialSelectedList.sort((a,b)=>(a.order - b.order));

		if(InitialSelectedList.length < 5)
		{
			this.setState({
				StatusConfig : {
					status : 'Please Select 5 Options',
					type : "warning"
				}
			},()=>{
				$('.popup__status').addClass('active');
				setTimeout(()=>{
					$('.popup__status').removeClass('active');
				},3000)
			})
		}
		else
		{
			Axios.post(`${REQUEST_BASE_URL}/SaveUserIndices/${PAN}`,{
				indexlist : InitialSelectedList
			}).then((res)=>{
				// console.log(res.data);
				let data = res.data;
				if(data.status === 'success')
				{
					this.setState({
						StatusConfig : {
							status : 'Saved Successfully!',
							type : "success"
						},
						InitialSelectedList : JSON.parse(JSON.stringify(InitialSelectedList)),
						InitialUnselectedList : JSON.parse(JSON.stringify(InitialUnselectedList)),
						indexflag : !this.state.indexflag,
						resetactive : false
					},()=>{
						$('.popup__status').addClass('active');
						setTimeout(()=>{
							$('.popup__status').removeClass('active');
						},3000)
					});
				}
				else
				{
					this.setState({
						StatusConfig : {
							status : 'Something went wrong!',
							type : "error"
						},
						indexflag : !this.state.indexflag,
						resetactive : false
					},()=>{
						$('.popup__status').addClass('active');
						setTimeout(()=>{
							$('.popup__status').removeClass('active');
						},3000)
					});
				}
			})
			.catch((err)=>{
				console.log(err)
			});
		}


		

		
	}

	resetIndexConfigs()
	{
		let {InitialUnselectedList,InitialSelectedList} = this.state;

		// console.log(InitialUnselectedList,InitialSelectedList);

		let IndicesList = JSON.parse(JSON.stringify(InitialUnselectedList.concat(InitialSelectedList)));

		this.setIndicesList(IndicesList,false);
		
	}

	reorderList(IndicesList)
	{
		IndicesList.sort((a,b) => (a.order - b.order));
		// console.log(IndicesList)
		let selectedindx = 1;
		IndicesList.forEach((ele,indx) =>{
			if(ele.order > 0)
			{
				IndicesList[indx]['order'] = selectedindx++;
			}
		});

		// console.log(IndicesList);
		this.setIndicesList(IndicesList);
		// return IndicesList;
	}

	openIndexPopup()
	{
		this.setState({
			indexopen : true
		});
		$('.app__back__blur').addClass('active');
	}

	closeIndexPopup()
	{
		this.setState({
			indexopen : false
		});
		$('.app__back__blur').removeClass('active');
	}

    render() {

		// console.log('Render Again');
		const {indexopen,IndicesList,indexflag,resetactive,StatusConfig,InitialSelectedList} = this.state;

        return (
            <>
				{indexopen && 
					<IndexSelectPopup 
						IndicesList={IndicesList}
						toggleIndexState={this.toggleIndexState}
						swapIndexState={this.swapIndexState} 
						saveIndexConfigs={this.saveIndexConfigs}
						resetIndexConfigs={this.resetIndexConfigs}
						closePopup={this.closeIndexPopup}
						StatusConfig={StatusConfig}
						indexflag={indexflag}
						resetactive={resetactive}
					/>
				}
				<div className="top__stocks">
					{
						InitialSelectedList.map((s,i)=>{
							return <UpperStock 
									{...s} 
									key={i}
									ws={this.props.ws}
							/>
						})
					}
					<div className="top__stocks__menu" onClick={()=> {this.openIndexPopup()}}>
						<img src={MoreDots} alt=""/>
					</div>
            	</div>

				
			</>
        )
    }
}

export default TopStocks;
