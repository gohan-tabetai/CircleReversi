const SIZE=8;
let turn=0;
let Board=
[["","","point","point","point","point","",""],
["","point","point","point","point","point","point",""],
["point","point","point","point","point","point","point","point"],
["point","point","point","black","white","point","point","point"],
["point","point","point","white","black","point","point","point"],
["point","point","point","point","point","point","point","point"],
["","point","point","point","point","point","point",""],
["","","point","point","point","point","",""],
];
//反時計回り
const round_list=[
    [0,2],[1,1],[2,0],[3,0],
    [4,0],[5,0],[6,1],[7,2],
    [7,3],[7,4],[7,5],[6,6],
    [5,7],[4,7],[3,7],[2,7],
    [1,6],[0,5],[0,4],[0,3]
]
const turn_text=document.querySelector("#turn")
const Board_view=get_board()
set_button();
change_view();

function set_button(){
    let buttons=document.querySelectorAll(".cell");
    for(let i in buttons){
        try{
            buttons[i].addEventListener("click",put_stone);
            buttons[i].value=i
        }catch{}
    }
}

//htmlから表示される盤の情報を取得
function get_board(){
    let cell_obj=document.querySelectorAll(".cell")
    let array=[]
    let board=[]
    for(let i in cell_obj){
        try{
            array.push(cell_obj[i].querySelector("div"))
            if(i%SIZE==SIZE-1){
                board.push(array)
                array=[]
            }
        }catch{}
    }
    return board
}

//htmlを変える
function change_view(){
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            Board_view[y][x].className="stone "+Board[y][x]
        }
    }
}

//クリックされたらこの関数が動く
function put_stone(){
    const y=Math.floor(this.value/SIZE)
    const x=this.value%SIZE
    console.log("put!!",y,x)
    if(reverse(y,x)){
        change_turn();
    }
}

//石をひっくり返す can_putの役目も果たす
function reverse(y,x){
    //置けたかどうか
    let flag=false;
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    for(dy=-1;dy<2;dy++){
        for(dx=-1;dx<2;dx++){
            if(check(y,x,dy,dx)){
                flag=true;
                for(let i=1;i<SIZE;i++){
                    if(Board[y+dy*i][x+dx*i]==opp_color){
                        Board[y+dy*i][x+dx*i]=my_color;
                    }else{
                        break;
                    }
                }
            }
        }   
    }
    console.log(flag)
    if(round_reverse(y,x,1)){flag=true};
    if(round_reverse(y,x,-1)){flag=true};
    if(flag){
        Board[y][x]=my_color
        
    }
    return flag;
}

//周りをひっくり返す.
//自分はひっくり返さない!!!!
function round_reverse(y,x,direction){
    if(!round_check(y,x,direction)){return false;}
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    direction=(round_list.length+direction)%round_list.length;
    //ここでエラーが出るっぽい.
    console.log("round_reverse中",[y,x])
    let arr_num=indexof_arr(round_list,[y,x])
    arr_num=(arr_num+direction)%round_list.length
    for(let i=0;i<round_list.length;i++){
        console.log(round_list[arr_num],Board[round_list[arr_num][0]][round_list[arr_num][1]],direction)
        if(Board[round_list[arr_num][0]][round_list[arr_num][1]]==opp_color){
            console.log("roundにおきました")
            Board[round_list[arr_num][0]][round_list[arr_num][1]]=my_color;
            arr_num=(arr_num+direction)%round_list.length;
        }else{
            return true;
        }
    }
    console.error("なんかおかしいで")
    return true;
}

//石が置けるかどうか
function can_put(y,x){
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    if(Board[y][x]!="point"){return false;}
    for(dy=-1;dy<2;dy++){
        for(dx=-1;dx<2;dx++){
            if(check(y,x,dy,dx)){
                return true;
            }
        }
    }
    if(round_check(y,x,1)||round_check(y,x,-1)){return true;}
    console.log("ここでおきている")
    return false;
}

//特定の方向におけるかどうか確かめる
function check(y,x,dy,dx){
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    if(Board[y][x]!="point"){return false;}
    if(dx==0&&dy==0){
        return false;
    }
    for(let i=1;i<SIZE;i++){
        //枠外
        if(y+dy*i<0||y+dy*i>SIZE-1||x+dx*i<0||x+dx*i>SIZE-1){
            break;
        }
        //自分の色を発見
        if(Board[y+dy*i][x+dx*i]==my_color){
            if(i>1){
                return true;
            }
            //真横は除外
            break;
        }else if(Board[y+dy*i][x+dx*i]!=opp_color){
        //敵の色
            break;
        }
    }
    return false;

}

//周囲の確認,1で反時計回り
function round_check(y,x,direction){
    console.log("round_check",y,x,direction)
    const my_color=turn ? "white":"black";
    const opp_color=!turn ? "white":"black";
    if(Board[y][x]!="point"){return false;}
    if(direction!=1&&direction!=-1){
        throw new Error("回り方へんやで")
    }
    let arr_num=indexof_arr(round_list,[y,x])
    //含まれていなかったら
    if(arr_num==-1){
        console.log("そーりー")
        return false;
    }
    console.log(y,x,arr_num)
    //マイナスをどうにかする.
    direction=(round_list.length+direction)%round_list.length
    console.log("arr.before",arr_num)
    arr_num=(arr_num+direction)%round_list.length
    console.log(direction,round_list.length)
    console.log("arr.after",arr_num)
    console.log(round_list.length+direction,round_list.length)
    for(let i=0;i<round_list.length;i++){
        console.log("forのなか",i,round_list[arr_num],Board[round_list[arr_num][0]][round_list[arr_num][1]])
        if(Board[round_list[arr_num][0]][round_list[arr_num][1]]==my_color){
            if(i==0){
                console.log("here")
                return false;
            }
            return true;
        }
        if(Board[round_list[arr_num][0]][round_list[arr_num][1]]==opp_color){
            arr_num=(arr_num+direction)%round_list.length;
        }else{
            if(i==round_list.length-1){
                return true;
            }
            console.log("ここ",Board[round_list[arr_num][0]][round_list[arr_num][1]])
            return false;
        }
        
    }
}
function change_turn(){
    change_view();
    if(is_finished()){
        finish()
    }else{
        turn=1-turn;
        console.log(turn)
        turn_text.textContent=(turn? "白":"黒")+"の番です"
        if(is_pass()){
            turn=1-turn;
            if(is_pass()){
                finish()
            }else{
                window.alert("置ける場所がないのでパスします")
                turn_text.textContent=(turn? "白":"黒")+"の番です"
            }
        }
    }

}

//打つ場所がなくなったら終了でtrue
function is_finished(){
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            if(Board[y][x]=="point"){
                return false;
            }
        }
    }
    return true;
}
//パスするかどうか
function is_pass(){
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            if(can_put(y,x)){
                return false;
            }
        }
    }
    return true;
}

function finish(){
    let black_count=0;
    let white_count=0;
    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){
            if(Board[y][x]=="black"){
                black_count++;
            }else if(Board[y][x]=="white"){
                white_count++;
            }
        }
    }
    const winner= black_count>white_count? "黒":"白"
    turn_text.textContent=winner+"の勝ち! "+`黒${black_count} : 白${white_count}`
    console.log("finish!!")
}



function restart(){
    if(confirm("本当に終了しますか?")){
        window.location.href="./"
    }
}

function indexof_arr(main_array,arr){
    for(let i=0;i<main_array.length;i++){
        if(match_arr(main_array[i],arr)){
            //ここまで
            console.log("matched",main_array[i],arr)
            return i;
        }
    }
    return -1;
}
function match_arr(arr1,arr2){
    if(arr1.length!=arr2.length){return false;}
    for(let i=0;i<arr1.length;i++){
        if(arr1[i]!=arr2[i]){return false;}
    }
    return true;
}