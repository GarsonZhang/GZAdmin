import gzButton from './iview//button';
import GzModal from './iview/modal';
import gzMenu from './iview/menu';

import DragableTable from './iview/dragableTable';
import GzTreeGrid from './iview/treeGrid/tree';


import gzPanel from './layout/panel';
import gzTree from './controls/gz-tree';
import gzTreeSelect from './controls/gz-tree-select';



const gziview = {
    gzButton, GzModal, gzMenu, gzPanel,DragableTable,GzTreeGrid,gzTree,gzTreeSelect
};

const install = function (Vue) {
    Object.keys(gziview).forEach((key) => {
        Vue.component(key, gziview[key]);
    });
};

export default Object.assign(gziview, { install });