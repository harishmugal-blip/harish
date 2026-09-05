// ============================================================
//  MUSIC DATA — 151 songs, YouTube Music powered playback
//  Song plays via YouTube iframe (videoId resolved live via
//  /api/ytmusic and cached). "Open in YT Music" always works.
// ============================================================

export interface Song {
  id: string;
  title: string;
  artist: string;
  year: string;
  ytId?: string; // optional known/stored id, else resolved live
}

// compact tuple: [title, artist, year]
type T = [string, string, string];

const OLD_RAW: T[] = [
  ["Pal Pal Dil Ke Paas", "Kishore Kumar", "1973"],
  ["Mere Sapno Ki Rani", "Kishore Kumar", "1969"],
  ["Roop Tera Mastana", "Kishore Kumar", "1969"],
  ["Zindagi Ek Safar Hai Suhana", "Kishore Kumar", "1971"],
  ["Chingari Koi Bhadke", "Kishore Kumar", "1972"],
  ["Kora Kagaz Tha Yeh Man Mera", "Kishore Kumar & Lata", "1969"],
  ["Gaata Rahe Mera Dil", "Kishore Kumar & Lata", "1972"],
  ["Yeh Jo Mohabbat Hai", "Kishore Kumar", "1971"],
  ["O Mere Dil Ke Chain", "Kishore Kumar", "1972"],
  ["Khilona Jaan Kar Tum", "Mohammed Rafi", "1970"],
  ["Chaudhvin Ka Chand Ho", "Mohammed Rafi", "1960"],
  ["Yeh Chand Sa Roshan Chehra", "Mohammed Rafi", "1964"],
  ["Kya Hua Tera Wada", "Mohammed Rafi", "1977"],
  ["Badan Pe Sitare Lapete Hue", "Mohammed Rafi", "1969"],
  ["Maine Poochha Chand Se", "Mohammed Rafi", "1967"],
  ["Baharon Phool Barsao", "Mohammed Rafi", "1964"],
  ["Aaj Mausam Bada Beimaan Hai", "Mohammed Rafi", "1973"],
  ["Kabhi Kabhie Mere Dil Mein", "Mukesh", "1976"],
  ["Maine Tere Liye Hi Saat Rang Ke Sapne", "Mukesh", "1970"],
  ["Dost Dost Na Raha", "Mukesh", "1964"],
  ["Awara Hoon", "Mukesh", "1951"],
  ["Mera Joota Hai Japani", "Mukesh", "1955"],
  ["Lag Ja Gale", "Lata Mangeshkar", "1964"],
  ["Ajeeb Dastan Hai Yeh", "Lata Mangeshkar", "1960"],
  ["Tere Bina Zindagi Se Koi", "Kishore & Lata", "1975"],
  ["Piya Tu Ab To Aaja", "Asha Bhosle & RD Burman", "1971"],
  ["Dum Maro Dum", "Asha Bhosle", "1971"],
  ["Chura Liya Hai Tumne", "Asha Bhosle", "1966"],
  ["In Aankhon Ki Masti Ke", "Asha Bhosle", "1980"],
  ["Parde Mein Rehne Do", "Asha Bhosle", "1968"],
  ["Aap Yahan Aa Kis Liye Aaye", "Asha Bhosle", "1966"],
  ["Ek Ladki Ko Dekha", "Kumar Sanu", "1994"],
  ["Chura Ke Dil Mera", "Kumar Sanu & Alka Yagnik", "1994"],
  ["Ab Tere Bin Jee Lenge Hum", "Kumar Sanu", "1994"],
  ["Bas Ek Sanam Chahiye", "Kumar Sanu", "1993"],
  ["Yeh Kaali Kaali Aankhen", "Kumar Sanu", "1992"],
  ["Sochenge Tumhe Pyar", "Kumar Sanu", "1991"],
  ["Dheere Dheere Se Meri Zindagi", "Kumar Sanu & Anuradha", "1990"],
  ["Nazar Ke Samne Jigar Ke Paas", "Kumar Sanu & Asha", "1991"],
  ["Pehla Nasha", "Udit Narayan & Sadhana Sargam", "1993"],
  ["Papa Kehte Hain", "Udit Narayan", "1988"],
  ["Ae Mere Humsafar", "Udit Narayan & Alka", "1991"],
  ["Maine Pyar Kiya (Dosti Theme)", "S.P. Balasubrahmanyam", "1989"],
  ["Dil Deewana", "S.P. Balasubrahmanyam & Lata", "1989"],
  ["Deewana Tera", "Sonu Nigam", "1999"],
  ["Sandese Aate Hain", "Sonu Nigam & Roopkumar", "1997"],
  ["Kuch Kuch Hota Hai", "Udit Narayan & Alka Yagnik", "1998"],
  ["Ladki Badi Anjani Hai", "Kumar Sanu & Alka Yagnik", "1998"],
  ["Tujhe Dekha To Ye Jaana Sanam", "Lata & Kumar Sanu", "1995"],
  ["Mehndi Laga Ke Rakhna", "Lata & Udit Narayan", "1995"],
  ["Ho Gaya Hai Tujhko To Pyar Sajna", "Lata & Udit Narayan", "1995"],
  ["Ruk Ja O Dil Deewane", "Udit Narayan", "1995"],
  ["Bholi Si Surat", "Lata & Udit Narayan", "1997"],
  ["Chaiyya Chaiyya", "Sukhwinder Singh & Sapna", "1998"],
  ["Dil To Pagal Hai", "Udit Narayan & Lata", "1997"],
  ["Le Gayi Le Gayi", "Asha Bhosle & Udit", "1997"],
  ["Aur Pass", "Udit Narayan & Alka Yagnik", "2000"],
  ["Humko Humise Chura Lo", "Udit Narayan & Lata", "2000"],
  ["Tumhe Jo Maine Dekha", "Udit Narayan & Alka", "2004"],
  ["Main Yahaan Hoon", "Udit Narayan", "2004"],
  ["Kalonchoe (Mitwa)", "Shankar Mahadevan", "2006"],
  ["Kabhi Alvida Naa Kehna", "Sonu Nigam & Alka", "2006"],
  ["Mitwa", "Shafqat Amanat Ali", "2006"],
  ["Tum Se Hi", "Mohit Chauhan", "2007"],
  ["Maula Mere Maula", "Roop Kumar Rathod", "2007"],
  ["Pehli Nazar Mein", "Atif Aslam", "2008"],
  ["Tera Hone Laga Hoon", "Atif Aslam & Alisha", "2009"],
  ["Tu Jaane Na", "Atif Aslam", "2009"],
  ["Tujhi Mein", "Atif Aslam", "2009"],
  ["Piya O Re Piya", "Atif Aslam & Shreya", "2011"],
  ["Tum Hi Ho (Acoustic era gem)", "Arijit Singh", "2013"],
  ["Sawan Aaya Hai", "Arijit Singh", "2014"],
  ["Muskurane", "Arijit Singh", "2014"],
  ["Samjhawan", "Arijit Singh & Shreya", "2014"],
  ["Hamdard", "Arijit Singh", "2014"],
  ["Manwa Laage", "Arijit Singh & Shreya", "2014"],
];

const NEW_RAW: T[] = [
  ["Tum Hi Ho", "Arijit Singh", "2013"],
  ["Channa Mereya", "Arijit Singh", "2016"],
  ["Ae Dil Hai Mushkil", "Arijit Singh", "2016"],
  ["Enna Sona", "Arijit Singh", "2017"],
  ["Nashe Si Chadh Gayi", "Arijit Singh", "2016"],
  ["Soch Na Sake", "Arijit Singh", "2016"],
  ["Janam Janam", "Arijit Singh", "2015"],
  ["Gerua", "Arijit Singh", "2015"],
  ["Agar Tum Saath Ho", "Arijit Singh & Alka", "2015"],
  ["Kesariya", "Arijit Singh", "2022"],
  ["Tum Kya Mile", "Arijit Singh & Shreya", "2023"],
  ["Tere Hawaale", "Arijit Singh", "2023"],
  ["Heeriye", "Jasleen Royal & Arijit", "2023"],
  ["Apna Bana Le", "Sachin-Jigar & Arijit", "2022"],
  ["Raataan Lambiyan", "Jubin Nautiyal & Asees", "2021"],
  ["Tumse Pyaar Karke", "Jubin Nautiyal", "2023"],
  ["Tujhe Kitna Chahne Lage", "Jubin Nautiyal", "2019"],
  ["Lut Gaye", "Jubin Nautiyal", "2021"],
  ["Tum Hi Aana", "Jubin Nautiyal", "2019"],
  ["Bekhayali", "Sachet Tandon", "2019"],
  ["Kabir Singh (Tujhe Kitna Chahne Lage)", "Jubin Nautiyal", "2019"],
  ["Pehle Pyaar Ka Pehla Dard", "Jubin Nautiyal", "2020"],
  ["Khairiyat", "Arijit Singh", "2019"],
  ["Kalank Title Track", "Arijit Singh", "2019"],
  ["Ghodey Pe Sawaar", "Amitabh Bhattacharya", "2022"],
  ["Qaafirana", "Arijit Singh", "2018"],
  ["Aashiqui Mashup", "Various Artists", "2015"],
  ["Ilahi", "Arijit Singh", "2014"],
  ["Kabira", "Tochi Raina & Rekha", "2013"],
  ["Manja", "Amit Trivedi", "2013"],
  ["Zaalima", "Arijit Singh & Harshdeep", "2017"],
  ["Hawayein", "Arijit Singh", "2017"],
  ["Ranjha", "B Praak & Jasleen", "2021"],
  ["Dhokha", "Arijit Singh", "2022"],
  ["Phir Aur Kya Chahiye", "Arijit Singh", "2022"],
  ["Tere Vaaste", "Varun Jain & Sachin-Jigar", "2023"],
  ["Choo Lo", "The Local Train", "2015"],
  ["Khoya", "The Local Train", "2018"],
  ["Kahani", "Sunidhi Chauhan", "2022"],
  ["Kesariya (Ballam Waali)", "Arijit Singh", "2022"],
  ["Jhoome Jo Pathaan", "Vishal-Sheykhar ft Sukhwinder", "2023"],
  ["Besharam Rang", "Shilpa Rao, Caralisa", "2022"],
  ["Jhoome Jo Pathaan (Trap Mix)", "Vishal-Sheykhar", "2023"],
  ["Naatu Naatu", "Rahul Sipligunj & Kaala", "2022"],
  ["Srivalli", "Sid Sriram", "2021"],
  ["Oo Antava", "Indravathi Chauhan", "2021"],
  ["Butta Bomma", "Armaan Malik", "2020"],
  ["Ramuloo Ramulaa", "Anurag Kulkarni", "2020"],
  ["Saami Saami", "Mounika Yadav", "2021"],
  ["Kala Chashma", "Badshah, Neha Kakkar", "2016"],
  ["Kar Gayi Chull", "Badshah, Fazilpuria", "2016"],
  ["Saturday Saturday", "Badshah, Akriti Kakar", "2014"],
  ["Abhi Toh Party Shuru Hui Hai", "Badshah", "2014"],
  ["DJ Waley Babu", "Badshah ft Aastha", "2015"],
  ["Wakhra Swag", "Navv Inder ft Badshah", "2015"],
  ["Proper Patola", "Badshah & Diljit", "2018"],
  ["Lamberghini", "The Doorbeen ft Ragini", "2018"],
  ["Coca Cola", "Tony Kakkar & Neha", "2019"],
  ["Cringe", "Payal Dev ft Badshah", "2022"],
  ["Srivalli (Hindi)", "Jubin Nautiyal", "2022"],
  ["Meri Jaan", "Gangubai / Neeti Mohan", "2022"],
  ["Shikayat", "King", "2023"],
  ["Maan Meri Jaan", "King", "2022"],
  ["OOPS", "King", "2023"],
  ["Tu Aake Dil Mein", "King", "2020"],
  ["Brown Munde", "AP Dhillon", "2020"],
  ["Excuses", "AP Dhillon", "2020"],
  ["Tera Ki Khayal", "AP Dhillon", "2021"],
  ["Insane", "AP Dhillon", "2022"],
  ["With You", "AP Dhillon", "2023"],
  ["Pasoori", "Shae Gill & Ali Sethi", "2022"],
  ["Kahani Suno", "Kaifi Khalil", "2022"],
  ["Tere Bin (Serial)", "Nusrat Fateh Ali Khan remix", "2023"],
  ["Saiyaan", "Rahul Vaidya", "2023"],
  ["O Bedardeya", "Arijit Singh", "2023"],
];

function build(raw: T[], prefix: string): Song[] {
  return raw.map((r, i) => ({
    id: `${prefix}-${i}`,
    title: r[0],
    artist: r[1],
    year: r[2],
  }));
}

export const OLD_SONGS: Song[] = build(OLD_RAW, "old");
export const NEW_ERAS: Song[] = build(NEW_RAW, "new");
export const ALL_SONGS: Song[] = [...OLD_SONGS, ...NEW_ERAS];
export const TOTAL_SONGS = ALL_SONGS.length;

export function songSearchQuery(s: Song): string {
  // NOTE: route adds its own suffixes ("full song youtube" etc) — keep this clean
  return `${s.title} ${s.artist}`;
}

export function ytMusicSearchUrl(s: Song): string {
  return `https://music.youtube.com/search?q=${encodeURIComponent(`${s.title} ${s.artist}`)}`;
}
