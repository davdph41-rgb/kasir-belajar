export default function handler(req,res){
  if(req.method!=="POST")
    return res.status(405).json({message:"Method tidak diizinkan"});

  const {cart}=req.body;

  if(!Array.isArray(cart)||!cart.length)
    return res.status(400).json({message:"Keranjang kosong"});

  const items=cart.map(item=>({
    product:item.name,
    qty:Number(item.qty),
    price:Number(item.price),
    subtotal:Number(item.price)*Number(item.qty)
  }));

  const total=items.reduce((sum,item)=>sum+item.subtotal,0);

  const orderId=`ORDER-${Date.now()}`;

  res.status(200).json({
    status:"success",
    order_id:orderId,
    items,
    total
  });
}
