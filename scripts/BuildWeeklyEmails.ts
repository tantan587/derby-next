import League from '../server/source/League'

const buildEmails = ():void => {
  let league = new League("hello")
  league.Create()
  league.Print()
}

buildEmails()