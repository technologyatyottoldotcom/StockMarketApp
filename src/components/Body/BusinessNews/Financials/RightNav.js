import { useState } from 'react'
import { QuoteNav } from '../QuoteNav';

export function RightNav({ childrens = [], active }) {
    const [Active,setActive] = useState(active)
    return (
        childrens.length ? <>
            <div style={{position:'relative',float:'right',top:-20 ,lineHeight: .5 }}>
                <QuoteNav onClick={(i, e) => { setActive(i)}} activeClassName="chart-nav-fields-active" className="chart-nav-fields" style={{ paddingLeft: 0, margin: 0, listStyleType: 'none' }}>
                    {childrens.map((v, i) => {
                        return <button key={v + i + Math.random() * 9} active={Active === i}>{v} </button>
                    })
                    }
                </QuoteNav>
            </div>
        </> : null
    )

}

export default RightNav