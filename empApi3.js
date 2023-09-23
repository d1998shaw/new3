let express=require("express");
let app=express();
let cors=require("cors");

app.use(express.json());
const corsOptions={
    origin:'http://localhost:3000',
    Credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET","POST","OPTIONS","PUT","PATCH","DELETE","HEAD"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

const {Client}=require("pg");
const client=new Client({
    user:"postgres",
    password:"9jdvGQvhH9dyAvEd",
    database:"postgres",
    port:5432,
    host:"db.guaiczkgmflqvyhohxtq.supabase.co",
    ssl:{rejectUnauthorized:false},
});

client.connect(function(res,error){
console.log(`Connected!!!!`);
});

app.get("/emp/:empcode",function(req,res){
    let empcode=+req.params.empcode;
    let value=[empcode];
    let sql=`SELECT * FROM employees WHERE empcode=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send(err);
        else res.send(result.rows);
    //client.end();
    })
})

app.get("/svr/emps",function(req,res,next){
    console.log("Inside/users get Api");
    let department=req.query.department;
    let designation=req.query.designation;
    let gender=req.query.gender;
    
    const query=`SELECT * FROM employees`;
    client.query(query,function(err,result){
        if (err) {
            console.log(err);
            res.status(400).send(err);}
            if(department){
            result.rows=result.rows.filter((n)=>n.department===department);
        }
        if(designation){
            result.rows=result.rows.filter((n)=>n.designation===designation);
        }
        if(gender){
            result.rows=result.rows.filter((n)=>n.gender===gender);
        }
        res.send(result.rows);
    //client.end();
    });
});
app.get("/svr/department/:department",function(req,res){
    let department=req.params.department;
    let value=[department];
    let sql=`SELECT * FROM employees WHERE department=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send("Error in Database",err);
        else{
        res.send(result.rows);
    //client.end();
    } 
    })
})

app.get("/svr/designation/:designation",function(req,res){
    let designation=req.params.designation;
    let value=[designation];
    let sql=`SELECT * FROM employees WHERE designation=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send("Error in Database",err.message);
        else{
        res.send(result.rows);
    //client.end();    
    } 
    })
})

app.post("/svr/emps",function(req,res,next){
    console.log("Inside post of user");
    var values=Object.values(req.body);
    console.log(values);
    const query=`INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if (err){
            res.status(400).send(err);
        }
        res.send(`insertion successful`);
      //  client.end();
    });
});
app.put("/svr/edit/:empcode",function(req,res,next){
    console.log("Inside put of user");
    let empcode=+req.params.empcode;
    let department=req.body.department;
    let designation=req.body.designation;
    let salary=req.body.salary;
    let name=req.body.name;
    let gender=req.body.gender;
    let values=[name,department,designation,salary,gender,empcode];
    const query=`UPDATE employees SET name=$1,department=$2,designation=$3,salary=$4,gender=$5 WHERE empcode=$6`;
    client.query(query,values,function(err,result){
        if (err){
            console.log(err);
            res.status(400).send(err);
        }
        res.send(`update successful`);
        //client.end();
    });
});

app.delete("/svr/delete/:empCode",function(req,res){
    let empCode=+req.params.empCode;
    let value=[empCode];
    let sql='DELETE FROM employees WHERE empCode=$1';
    client.query(sql,value,function(err,result){
        if(err)
         console.log("Error in Database");
        else {
    res.send("Successfully deleted.");
        }
        //client.end();
        })
    })
