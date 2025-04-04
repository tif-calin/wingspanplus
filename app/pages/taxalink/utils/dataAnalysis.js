import DATA from '../../../data/cards';

const API_URL = (latin) => `https://api.checklistbank.org/dataset/9812/nameusage/search?TAXON_ID=V2&extinct=false&extinct=&facet=rank&facet=issue&facet=status&facet=nomStatus&facet=nameType&facet=field&facet=authorship&facet=extinct&facet=environment&field=specific%20epithet&limit=50&nameType=scientific&nomstatus=acceptable&offset=0&q=${latin}&sortBy=taxonomic&status=_NOT_NULL`;

const orderStats = async () => {
  const good = {};

  Promise.all(DATA
    .map(async card => {
      const latin = card?.['Scientific name'];
      good[latin] = false;
      if (!latin) return; // console.debug('No latin name');

      let data;
      try {
        const resp = await fetch(API_URL(latin));
        data = (await resp.json())?.result?.[0];
        if (!data) {
          // console.debug('No COL data', latin)
          return null;
        };
      }
      catch (e) {
        // console.log('error', latin);
        return null;
      }
      const order = data?.classification?.find(c => c.rank === 'order')?.name;

      if (order) good[latin] = true;
      return order;
    })
  ).then((data) => data.filter(d => d).reduce(
    (a, c) => ({ ...a, [c]: ~~a[c] + 1 }), 
    {}
  )).then(data => {
    console.log(Object.entries(good).filter(([_, good]) => !good).map(([l]) => l));
    console.table(data);
    
    console.log(Object.entries(data).reduce((a, [k, v]) => a + `${k}\t${v}\n`, ''));
  });
};

orderStats();
