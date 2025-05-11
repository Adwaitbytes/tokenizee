local bint = require('.bint')(256)
--[[
  This module implements the ao Standard Token Specification.

  Terms:
    Sender: the wallet or Process that sent the Message

  It will first initialize the internal state, and then attach handlers,
    according to the ao Standard Token Spec API:

    - Info(): return the token parameters, like Name, Ticker, Logo, and Denomination

    - Balance(Target?: string): return the token balance of the Target. If Target is not provided, the Sender
        is assumed to be the Target

    - Balances(): return the token balance of all participants

    - Transfer(Target: string, Quantity: number): if the Sender has a sufficient balance, send the specified Quantity
        to the Target. It will also issue a Credit-Notice to the Target and a Debit-Notice to the Sender

    - Mint(Quantity: number): if the Sender matches the Process Owner, then mint the desired Quantity of tokens, adding
        them the Processes' balance
]]
--
local json = require('json')

--[[
  utils helper functions to remove the bint complexity.
]]
--
local utils = {
  add = function(a, b)
    return tostring(bint(a) + bint(b))
  end,
  subtract = function(a, b)
    return  tostring(bint(a) - bint(b))
  end,
  toBalanceValue = function(a)
    return tostring(bint(a))
  end,
  toNumber = function(a)
    return bint.tonumber(a)
  end
}


--[[
     Initialize State

     ao.id is equal to the Process.Id
   ]]
Variant = "0.0.3"

-- token should be idempotent and not change previous state updates
Denomination = Denomination or 12
Balances = Balances or { [ao.id] = utils.toBalanceValue(10000 * 10 ^ Denomination) }
TotalSupply = TotalSupply or utils.toBalanceValue(10000 * 10 ^ Denomination)
Name = Name or 'Points Coin'
Ticker = Ticker or 'PNTS'
Logo = Logo or 'SBCCXwwecBlDqRLUjb8dYABExTJXLieawf7m2aBJ-KY'

--[[
     Add handlers for each incoming Action defined by the ao Standard Token Specification
   ]]
--

--[[
     Info
   ]]
--
Handlers.add('info', Handlers.utils.hasMatchingTag("Action", "Info"), function(msg)
  if msg.reply then
    msg.reply({
      Name = Name,
      Ticker = Ticker,
      Logo = Logo,
      Denomination = tostring(Denomination)
    })
  else
    Send({Target = msg.From, 
    Name = Name,
    Ticker = Ticker,
    Logo = Logo,
    Denomination = tostring(Denomination)
   })
  end
end)

--[[
     Balance
   ]]
--
Handlers.add('balance', Handlers.utils.hasMatchingTag("Action", "Balance"), function(msg)
  local bal = '0'

  -- If not Recipient is provided, then return the Senders balance
  if (msg.Tags.Recipient) then
    if (Balances[msg.Tags.Recipient]) then
      bal = Balances[msg.Tags.Recipient]
    end
  elseif msg.Tags.Target and Balances[msg.Tags.Target] then
    bal = Balances[msg.Tags.Target]
  elseif Balances[msg.From] then
    bal = Balances[msg.From]
  end
  if msg.reply then
    msg.reply({
      Balance = bal,
      Ticker = Ticker,
      Account = msg.Tags.Recipient or msg.From,
      Data = bal
    })
  else
    Send({
      Target = msg.From,x
      Balance = bal,
      Ticker = Ticker,
      Account = msg.Tags.Recipient or msg.From,
      Data = bal
    })
  end
end)

--[[
     Balances
   ]]
--
Handlers.add('balances', Handlers.utils.hasMatchingTag("Action", "Balances"),
  function(msg) 
    if msg.reply then
      msg.reply({ Data = json.encode(Balances) })
    else 
      Send({Target = msg.From, Data = json.encode(Balances) }) 
    end
  end)

--[[
     Transfer
   ]]
--
Handlers.add('transfer', Handlers.utils.hasMatchingTag("Action", "Transfer"), function(msg)
  assert(type(msg.Recipient) == 'string', 'Recipient is required!')
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(0, bint(msg.Quantity)), 'Quantity must be greater than 0')

  if not Balances[msg.From] then Balances[msg.From] = "0" end
  if not Balances[msg.Recipient] then Balances[msg.Recipient] = "0" end

  if bint(msg.Quantity) <= bint(Balances[msg.From]) then
    Balances[msg.From] = utils.subtract(Balances[msg.From], msg.Quantity)
    Balances[msg.Recipient] = utils.add(Balances[msg.Recipient], msg.Quantity)

    --[[
         Only send the notifications to the Sender and Recipient
         if the Cast tag is not set on the Transfer message
       ]]
    --
    if not msg.Cast then
      -- Debit-Notice message template, that is sent to the Sender of the transfer
      local debitNotice = {
        Action = 'Debit-Notice',
        Recipient = msg.Recipient,
        Quantity = msg.Quantity,
        Data = Colors.gray ..
            "You transferred " ..
            Colors.blue .. msg.Quantity .. Colors.gray .. " to " .. Colors.green .. msg.Recipient .. Colors.reset
      }
      -- Credit-Notice message template, that is sent to the Recipient of the transfer
      local creditNotice = {
        Target = msg.Recipient,
        Action = 'Credit-Notice',
        Sender = msg.From,
        Quantity = msg.Quantity,
        Data = Colors.gray ..
            "You received " ..
            Colors.blue .. msg.Quantity .. Colors.gray .. " from " .. Colors.green .. msg.From .. Colors.reset
      }

      -- Add forwarded tags to the credit and debit notice messages
      for tagName, tagValue in pairs(msg) do
        -- Tags beginning with "X-" are forwarded
        if string.sub(tagName, 1, 2) == "X-" then
          debitNotice[tagName] = tagValue
          creditNotice[tagName] = tagValue
        end
      end

      -- Send Debit-Notice and Credit-Notice
      if msg.reply then
        msg.reply(debitNotice)
      else
        debitNotice.Target = msg.From
        Send(debitNotice)
      end
      Send(creditNotice)
    end
  else
    if msg.reply then
      msg.reply({
        Action = 'Transfer-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Insufficient Balance!'
      })
    else
      Send({
        Target = msg.From,
        Action = 'Transfer-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Insufficient Balance!'
      })
    end
  end
end)

--[[
    Mint
   ]]
--
Handlers.add('mint', Handlers.utils.hasMatchingTag("Action","Mint"), function(msg)
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint(0) < bint(msg.Quantity), 'Quantity must be greater than zero!')

  if not Balances[ao.id] then Balances[ao.id] = "0" end

  if msg.From == ao.id then
    -- Add tokens to the token pool, according to Quantity
    Balances[msg.From] = utils.add(Balances[msg.From], msg.Quantity)
    TotalSupply = utils.add(TotalSupply, msg.Quantity)
    if msg.reply then
      msg.reply({
        Data = Colors.gray .. "Successfully minted " .. Colors.blue .. msg.Quantity .. Colors.reset
      })
    else
      Send({
        Target = msg.From,
        Data = Colors.gray .. "Successfully minted " .. Colors.blue .. msg.Quantity .. Colors.reset
      })
    end
  else
    if msg.reply then
      msg.reply({
        Action = 'Mint-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only the Process Id can mint new ' .. Ticker .. ' tokens!'
      })
    else
      Send({
        Target = msg.From,
        Action = 'Mint-Error',
        ['Message-Id'] = msg.Id,
        Error = 'Only the Process Id can mint new ' .. Ticker .. ' tokens!'
      })
    end
  end
end)

--[[
     Total Supply
   ]]
--
Handlers.add('totalSupply', Handlers.utils.hasMatchingTag("Action","Total-Supply"), function(msg)
  assert(msg.From ~= ao.id, 'Cannot call Total-Supply from the same process!')
  if msg.reply then
    msg.reply({
      Action = 'Total-Supply',
      Data = TotalSupply,
      Ticker = Ticker
    })
  else
    Send({
      Target = msg.From,
      Action = 'Total-Supply',
      Data = TotalSupply,
      Ticker = Ticker
    })
  end
end)

--[[
 Burn
]] --
Handlers.add('burn', Handlers.utils.hasMatchingTag("Action",'Burn'), function(msg)
  assert(type(msg.Tags.Quantity) == 'string', 'Quantity is required!')
  assert(bint(msg.Tags.Quantity) <= bint(Balances[msg.From]), 'Quantity must be less than or equal to the current balance!')

  Balances[msg.From] = utils.subtract(Balances[msg.From], msg.Tags.Quantity)
  TotalSupply = utils.subtract(TotalSupply, msg.Tags.Quantity)
  if msg.reply then
    msg.reply({
      Data = Colors.gray .. "Successfully burned " .. Colors.blue .. msg.Tags.Quantity .. Colors.reset
    })
  else
    Send({Target = msg.From,  Data = Colors.gray .. "Successfully burned " .. Colors.blue .. msg.Tags.Quantity .. Colors.reset })
  end
end)

--[[
    Like Post and Transfer Tokens
]]
Handlers.add('likePost', Handlers.utils.hasMatchingTag("Action", "LikePost"), function(msg)
  assert(type(msg.PostId) == 'string', 'PostId is required!')
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')

  local postId = msg.PostId
  local quantity = msg.Quantity
  local likerProcess = msg.From
  local likerWallet = msg.Tags and msg.Tags.Wallet
  local ownerInfo = postOwners[postId]

  -- Post must exist and have an owner
  if not ownerInfo or not ownerInfo.ProcessId or not ownerInfo.Wallet then
    return Send({
      Target = likerProcess,
      Action = 'Like-Error',
      Error = 'Post owner info is missing or post not found.'
    })
  end

  local postOwnerProcess = ownerInfo.ProcessId
  local postOwnerWallet = ownerInfo.Wallet

  -- Ensure likes table exists for the post
  if not postLikes[postId] then
    postLikes[postId] = {}
  end

  -- Prevent double like
  for _, user in ipairs(postLikes[postId]) do
    if user == likerProcess then
      return Send({
        Target = likerProcess,
        Action = 'Like-Error',
        Error = 'You have already liked this post.'
      })
    end
  end

  -- Check balance
  if bint(quantity) > bint(Balances[likerProcess] or "0") then
    return Send({
      Target = likerProcess,
      Action = 'Transfer-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Insufficient Balance to like!'
    })
  end

  -- Transfer tokens from liker to post owner
  Balances[likerProcess] = utils.subtract(Balances[likerProcess], quantity)
  Balances[postOwnerProcess] = utils.add(Balances[postOwnerProcess] or "0", quantity)

  -- Add like record
  table.insert(postLikes[postId], likerProcess)

  -- Transfer post token from post owner to liker
  Send({
    Target = likerProcess,
    Action = "Transfer",
    Tags = {
      Quantity = "1",  -- Can be custom logic
      Recipient = likerWallet
    },
    From = postOwnerProcess
  })

  -- Notify
  local message = Colors.gray .. "You liked the post and received a token from the post owner!"
  if msg.reply then
    msg.reply({
      Action = 'Like-Notice',
      Data = message
    })
  else
    Send({
      Target = likerProcess,
      Action = 'Like-Notice',
      Data = message
    })
  end
end)

--[[
    Like Action - Generates a token when a user likes the post
]]
--
Handlers.add('like', Handlers.utils.hasMatchingTag("Action", "Like"), function(msg)
  -- Generate a token for the user who liked the post
  local quantity = "1"  -- Define the quantity of tokens to generate (1 token for each like)

  -- Mint tokens for the user
  if not Balances[msg.From] then Balances[msg.From] = "0" end
  Balances[msg.From] = utils.add(Balances[msg.From], quantity)
  TotalSupply = utils.add(TotalSupply, quantity)

  -- Notify the user of the generated token
  local likeNotice = {
    Action = 'Like-Notice',
    Recipient = msg.From,
    Quantity = quantity,
    Data = Colors.gray .. "You earned " .. Colors.blue .. quantity .. Colors.reset .. " for liking the post!"
  }

  -- Send the Like-Notice
  if msg.reply then
    msg.reply(likeNotice)
  else
    Send(likeNotice)
  end
end)
