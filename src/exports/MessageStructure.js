let MarketDataStructure = [
    {
        field : 'exchange_code',
        start : 1,
        end : 2,
        type : 'n'
    },
    {
        field : 'instrument_token',
        start : 2,
        end : 6,
        type : 'n'
    },
    {
        field : 'last_traded_price',
        start : 6,
        end : 10,
        type : 'p'
    },
    {
        field : 'last_traded_time',
        start : 10,
        end : 14,
        type : 't'
    },
    {
        field : 'last_traded_quantity',
        start : 14,
        end : 18,
        type : 'n'
    },
    {
        field : 'trade_volume',
        start : 18,
        end : 22,
        type : 'n'
    },
    {
        field : 'best_bid_price',
        start : 22,
        end : 26,
        type : 'p'
    },
    {
        field : 'best_bid_quantity',
        start : 26,
        end : 30,
        type : 'n'
    },
    {
        field : 'best_ask_price',
        start : 30,
        end : 34,
        type : 'p'
    },
    {
        field : 'best_ask_quantity',
        start : 34,
        end : 38,
        type : 'n'
    },
    {
        field : 'total_buy_quantity',
        start : 38,
        end : 46,
        type : 'n'
    },
    {
        field : 'total_sell_quantity',
        start : 46,
        end : 54,
        type : 'n'
    },
    {
        field : 'average_trade_price',
        start : 54,
        end : 58,
        type : 'p'
    },
    {
        field : 'exchange_timestamp',
        start : 58,
        end : 62,
        type : 't'
    },
    {
        field : 'open_price',
        start : 62,
        end : 66,
        type : 'p'
    },
    {
        field : 'high_price',
        start : 66,
        end : 70,
        type : 'p'
    },
    {
        field : 'low_price',
        start : 70,
        end : 74,
        type : 'p'
    },
    {
        field : 'close_price',
        start : 74,
        end : 78,
        type : 'p'
    },
    {
        field : 'yearly_high_price',
        start : 78,
        end : 82,
        type : 'p'
    },
    {
        field : 'yearly_low_price',
        start : 82,
        end : 86,
        type : 'p'
    }
]

module.exports = {MarketDataStructure};
