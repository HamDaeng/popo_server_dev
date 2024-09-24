var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "migae5o25m2psr4q.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "-",
  password: "-",
  database: "-",
});

const CAT_API_URL = "https://api.thedogapi.com/";
const CAT_API_KEY = "-";

const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "!";

client.once("ready", () => {
  console.log(`${client.user.tag}에 로그인하였습니다!`);
});

client.on("message", (msg) => {
  let msg_arr = msg.content.split(" ");
  let Command = new Discord.MessageEmbed();
  let info_arr = ["나이", "생일", "오버워치", "발로란트", "스팀"];

  if (msg.author.bot || !msg.content.startsWith(prefix)) {
    return;
  }

  if (msg_arr[0] == prefix + "테스트") {
    let sql = "SELECT * FROM user_data";
    let userid = msg.author.id;
    let usernick = msg.author.username;

    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();

    let hours = now.getHours() + 9; //+9해야함
    let minutes = now.getMinutes();

    let date_now = new Date(year, month, date, hours, minutes);

    let n_month = date_now.getMonth();
    let n_date = date_now.getDate();

    connection.query(sql, function (err, results, fields) {
      if (err) {
        console.log(err);
      }

      let embed = "";

      embed = Command.setTitle(
        `:purple_heart: 포포서버 ${n_month}월 생일자 :purple_heart:`
      ).setColor("#e3bdff");

      let is_birth = false;

      for (let list_all of results) {
        let birth_ck = /[0-9]{1,2}( )*월( )*[0-9]{1,2}( )*일/g.test(
          list_all.birthday
        );
        let ck_months = list_all.birthday.match(/[0-9]{1,2}( )*월/g);

        if (String(ck_months).replace(/\D/g, "") == n_month) {
          is_birth = true;

          embed.addFields({
            name: `${list_all.nickname}님의 생일`,
            value: `:tada: ${list_all.birthday} :tada:`,
          });
        }

        if (!is_birth) {
          embed.setDescription(`아쉽게도 ${n_month}월 생일자가 한명도 없네요!`);
        } else {
          embed.setFooter("생일이신분들 모두 축하드립니다!");
        }
      }

      msg.reply(embed);
    });
  }

  if (msg_arr[0] == prefix + "테스트2") {
    let sql = "SELECT * FROM user_data";
    let userid = msg.author.id;
    let usernick = msg.author.username;

    connection.query(sql, function (err, results, fields) {
      if (err) {
        console.log(err);
      }

      let embed = Command.setTitle(
        ":purple_heart: 전체 정보 :purple_heart:"
      ).setColor("#e3bdff");

      for (let list_all of results) {
        embed.addFields({
          name: `${list_all.nickname}님의 정보`,
          value: `**나이** : ${list_all.age} \| **생일** : ${list_all.birthday}\n**오버워치** : ${list_all.overwatch}\n**발로란트** : ${list_all.valorant}\n**스팀** : ${list_all.steam}`,
        });
      }

      msg.reply(embed);
    });
  }

  if (msg_arr[0] == prefix + "고양이" || msg_arr[0] == prefix + "야옹") {
    let random_count = Math.ceil(Math.random() * 30977);

    let embed = Command.setTitle(":cat: 랜덤 고양이 사진! :cat:")
      .setColor("#f1ccff")
      .setDescription(`고양이는 야옹!`)
      .setImage(`https://loremflickr.com/320/240?lock=${random_count}`);

    msg.reply(embed);
  }

  if (msg_arr[0] == prefix + "강아지" || msg_arr[0] == prefix + "멍멍") {
    let random_count = Math.ceil(Math.random() * 30977);

    let embed = Command.setTitle(":dog: 랜덤 강아지 사진! :dog:")
      .setColor("#f1ccff")
      .setDescription(`강아지는 멍멍!`)
      .setImage(`https://loremflickr.com/320/240/dog?lock=${random_count}`);

    msg.reply(embed);
  }

  if (
    msg_arr[0] == prefix + "정보등록" &&
    info_arr.includes(msg_arr[1]) &&
    Boolean(msg_arr[2])
  ) {
    let sql = "SELECT * FROM user_data";
    let userid = msg.author.id;
    let usernick = msg.author.username;

    connection.query(sql, function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      let checking_id = false;

      let temp_data = [];

      for (let temp_arr of results) {
        if (temp_arr.id.includes(userid)) {
          checking_id = true;
          temp_data[0] = temp_arr.age;
          temp_data[1] = temp_arr.birthday;
          temp_data[2] = temp_arr.overwatch;
          temp_data[3] = temp_arr.valorant;
          temp_data[4] = temp_arr.steam;
          break;
        }
      }

      let embed = "";

      if (checking_id) {
        let word = "";

        if (msg_arr[1] == "나이") {
          word = "age";
        } else if (msg_arr[1] == "생일") {
          word = "birthday";
        } else if (msg_arr[1] == "오버워치") {
          word = "overwatch";
        } else if (msg_arr[1] == "발로란트") {
          word = "valorant";
        } else if (msg_arr[1] == "스팀") {
          word = "steam";
        }

        msg_arr.shift();
        msg_arr.shift();
        let moreMsg = msg_arr.join(" ");

        sql = `UPDATE user_data SET ${word} = '${moreMsg}' WHERE id = '${userid}'`;

        connection.query(sql, function (err, results, fields) {
          if (err) {
            console.log(err);
          }
        });

        embed = Command.setTitle(":purple_heart: 알림 :purple_heart:")
          .setColor("#e3bdff")
          .setDescription(
            `${usernick}님의 정보수정이 정상적으로 완료되었습니다!`
          );
      } else {
        embed = Command.setTitle(":purple_heart: 알림 :purple_heart:")
          .setColor("#e3bdff")
          .setDescription(`정보 등록 전 !명령어 를 사용하여 갱신해주세요!`);
      }
      msg.reply(embed);
    });
  }

  if (msg_arr[0] == prefix + "주사위") {
    let dice = Math.ceil(Math.random() * 6);
    let usernick = msg.author.username;

    let dice_img = "";

    switch (dice) {
      case 1:
        dice_img =
          "https://cdn.discordapp.com/attachments/1024281970370412578/1033047796019888168/1.png";
        break;

      case 2:
        dice_img =
          "https://cdn.discordapp.com/attachments/1024281970370412578/1033047796485476353/2.png";
        break;

      case 3:
        dice_img =
          "https://cdn.discordapp.com/attachments/1024281970370412578/1033047796904886422/3.png";
        break;

      case 4:
        dice_img =
          "https://cdn.discordapp.com/attachments/1024281970370412578/1033047797366280262/4.png";
        break;

      case 5:
        dice_img =
          "https://cdn.discordapp.com/attachments/1024281970370412578/1033047797810864209/5.png";
        break;

      case 6:
        dice_img =
          "https://cdn.discordapp.com/attachments/1024281970370412578/1033047798251262073/6.png";
        break;
    }

    let embed = Command.setTitle(":heart: 주사위 결과! :heart:")
      .setColor("#ff8573")
      .setDescription(`${usernick}님의 주사위 결과!`)
      .setThumbnail(dice_img);

    msg.reply(embed);
  }

  if (msg_arr[0] == prefix + "정보" && Boolean(msg_arr[1])) {
    msg_arr.shift();
    let moreMsg = msg_arr.join(" ");

    let sql = "SELECT * FROM user_data";

    connection.query(sql, function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      let checking_id = false;

      let temp_data = [];

      for (let temp_arr of results) {
        if (temp_arr.nickname.includes(moreMsg)) {
          checking_id = true;
          temp_data[0] = temp_arr.age;
          temp_data[1] = temp_arr.birthday;
          temp_data[2] = temp_arr.overwatch;
          temp_data[3] = temp_arr.valorant;
          temp_data[4] = temp_arr.steam;
          break;
        }
      }

      let embed = "";

      if (checking_id) {
        embed = Command.setTitle(
          `:white_heart: ${moreMsg}님의 정보 :white_heart:`
        )
          .setColor("#ffffff")
          .addFields(
            { name: `나이`, value: `${temp_data[0]}`, inline: true },
            { name: `생일`, value: `${temp_data[1]}`, inline: true },
            { name: `오버워치 닉네임`, value: `${temp_data[2]}` },
            { name: `발로란트 닉네임`, value: `${temp_data[3]}` },
            { name: `스팀 닉네임`, value: `${temp_data[4]}` }
          );
      } else {
        embed = Command.setTitle(
          `:white_heart: ${moreMsg}님의 정보 :white_heart:`
        )
          .setColor("#ffffff")
          .setDescription(
            "해당되는 유저를 찾을 수 없습니다!\n서버에 있지만 검색이 안되는 경우 !명령어 로 갱신해주세요!"
          );
      }
      msg.reply(embed);
    });
  }

  if (msg_arr[0] == prefix + "정보도움말") {
    //msg.reply("안녕하세요! "+msg.author.username+ '님!' )
    let embed = Command.setTitle(":purple_heart: 정보 도움말! :purple_heart:")
      .setColor("#e3bdff")
      .setDescription("[] << 괄호는 빼고 작성해 주시면 됩니다!!")
      .addFields(
        {
          name: `:one: !정보등록 나이 [숫자]`,
          value: "나이를 공개합니다! 비워두셔도 좋습니다!",
        },
        {
          name: `:two: !정보등록 생일 [x월x일]`,
          value: "생일을 공개합니다! 비워두셔도 좋습니다!",
        },
        {
          name: `:three: !정보등록 오버워치 [닉네임#배틀태그]`,
          value: "오버워치 닉네임을 공개합니다!",
        },
        {
          name: `:four: !정보등록 발로란트 [닉네임#태그]`,
          value: "발로란트 닉네임을 공개합니다!",
        },
        {
          name: `:five: !정보등록 스팀 [닉네임or친구코드]`,
          value: "스팀 닉네임을 공개합니다!",
        }
      );

    msg.reply(embed);
  }

  if (msg_arr[0] == prefix + "명령어" || msg_arr[0] == prefix + "도움말") {
    let sql = "SELECT * FROM user_data";

    connection.query(sql, function (err, results, fields) {
      if (err) {
        console.log(err);
      }

      let user_id = msg.author.id;
      let user_nick = msg.author.username;
      let checking_id = false;

      for (let temp_arr of results) {
        if (temp_arr.id.includes(user_id)) {
          checking_id = true;
          break;
        }
      }

      if (!checking_id) {
        sql = `INSERT into user_data (id,nickname,age,birthday,overwatch,valorant,steam) values ('${user_id}','${user_nick}','-','-','-','-','-')`;
        connection.query(sql, function (err, results, fields) {
          if (err) {
            console.log(err);
          }
        });
      }

      let embed = Command.setTitle(":blue_heart: 포포서버 명령어 :blue_heart: ")
        .setColor("#c9f4ff")
        .setDescription(
          `안녕하세요! 저는 포포서버를 위해 태어났어요!\n제가 도와드릴 수 있는 명령어들을 알려드릴게요!!`
        )
        .addFields(
          {
            name: `:one: !소집 [할 말]`,
            value:
              "everyone 태그로 사람들을 모집합니다\n할 말 부분에 내용을 적으시면 같이 등록됩니다.",
          },
          {
            name: `:two: !주사위`,
            value: "1~6 까지의 주사위를 굴립니다! 무엇이 나올까 두근두근",
          },
          {
            name: `:three: !정보 [아이디]`,
            value: "해당 인원의 정보를 봅니다!\n",
          },
          {
            name: `:four: !정보도움말`,
            value: "정보 작성을 위한 가이드 입니다 참고해주세요!",
          },
          {
            name: `:five: !정보등록 [정보 이름] [내용]`,
            value:
              "다른 사람들에게 공개할 자신의 정보를 작성합니다!\n정보에는 오버워치/발로란트/스팀닉네임 등 여러가지가 들어갑니다!",
          }
        );

      msg.reply(embed);
    });
  }

  if (msg_arr[0] == prefix + "소집") {
    let embed = Command.setTitle(":yellow_heart: 포포서버 소집 :yellow_heart:")
      .setColor("#fff48f")
      .setDescription(`${msg.author.username}님이 소집하셨습니다!`)
      .setImage(
        "https://cdn.discordapp.com/attachments/1024281970370412578/1033040762507632700/83b1af978ce10427.gif"
      );
    // 소집 이미지 -> gif or 다른이미지로
    if (Boolean(msg_arr[1])) {
      msg_arr.shift();

      let moreMsg = msg_arr.join(" ");

      embed.addField(`${msg.author.username}님의 한마디`, moreMsg);
    }
    msg.channel.send("@everyone");
    msg.channel.send(embed);
  }
});

client.on("guildMemberAdd", (joinUser) => {
  let welcomembed = new Discord.MessageEmbed()
    .setTitle(":yellow_heart: 환영합니다! :yellow_heart:")
    .setColor("#fff48f")
    .setDescription(
      `${joinUser.user.username}님 안녕하세요! 포포서버에 오신걸 환영합니다!\n공지사항 확인해주시고 즐거운 하루 되세요~~ :10:\n봇 사용 명령어는 [!명령어]를 입력해주시면 됩니다!`
    )
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/1032277489604644874/1033004986977767514/20211005073311.1607351.jpg"
    );
  // 썸넬 하나 넣기
  let channel_ID = joinUser.guild.systemChannelID;

  client.channels.cache.get(channel_ID).send(welcomembed);
});

client.login("-");
//DB는 똑같은거 쓰니 조심
